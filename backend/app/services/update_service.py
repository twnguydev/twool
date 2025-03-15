from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
import os
import yaml
import json
from datetime import datetime
import re
from pathlib import Path
import shutil
import hashlib
from typing import Dict, List, Optional, Any, Tuple

from ..database import get_db
from ..config import get_settings
import logging
from ..models.base import Base

logger = logging.getLogger(__name__)
settings = get_settings()

UPDATES_DIR = os.path.join(settings.static_files_dir, "updates")
os.makedirs(UPDATES_DIR, exist_ok=True)

class UpdateService:
    def __init__(self, db: Session = Depends(get_db)):
        self.db = db
        
        # Créer les dossiers pour chaque plateforme s'ils n'existent pas
        for platform in ["win", "mac", "linux"]:
            os.makedirs(os.path.join(UPDATES_DIR, platform), exist_ok=True)
    
    async def get_latest_version(self, platform: str) -> Dict[str, Any]:
        """
        Récupère les informations sur la dernière version disponible pour une plateforme donnée.
        
        Args:
            platform: La plateforme cible (win, mac, linux)
            
        Returns:
            Un dictionnaire contenant les informations de version
        """
        platform = self._validate_platform(platform)
        manifest_path = await self.get_update_manifest_path(platform)
        
        if not manifest_path or not os.path.exists(manifest_path):
            raise ValueError(f"Aucun fichier de mise à jour trouvé pour la plateforme {platform}")
        
        try:
            with open(manifest_path, 'r') as f:
                manifest_data = yaml.safe_load(f)
                
            if not manifest_data:
                raise ValueError("Fichier de manifeste invalide ou vide")
                
            # Format attendu pour electron-updater
            version_info = {
                "version": manifest_data.get("version"),
                "notes": manifest_data.get("releaseNotes", ""),
                "publish_date": manifest_data.get("releaseDate", "")
            }
            
            # Vérifier que la version existe
            if not version_info["version"]:
                raise ValueError("Information de version manquante dans le manifeste")
                
            return version_info
        except Exception as e:
            logger.error(f"Erreur lors de la lecture du fichier de manifeste: {str(e)}")
            raise ValueError(f"Impossible de lire les informations de version: {str(e)}")
    
    async def get_update_manifest_path(self, platform: str) -> str:
        """
        Récupère le chemin vers le fichier de manifeste de mise à jour.
        
        Args:
            platform: La plateforme cible (win, mac, linux)
            
        Returns:
            Le chemin vers le fichier de manifeste (latest-{platform}.yml)
        """
        platform = self._validate_platform(platform)
        
        # Le nom du fichier selon la convention electron-updater
        filename = f"latest-{platform}.yml"
        file_path = os.path.join(UPDATES_DIR, platform, filename)
        
        if not os.path.exists(file_path):
            logger.warning(f"Fichier de manifeste non trouvé: {file_path}")
            return None
            
        return file_path
    
    async def get_update_file_path(self, platform: str, version: str) -> str:
        """
        Récupère le chemin vers le fichier d'installation pour une version et plateforme données.
        
        Args:
            platform: La plateforme cible (win, mac, linux)
            version: La version à télécharger
            
        Returns:
            Le chemin vers le fichier d'installation
        """
        platform = self._validate_platform(platform)
        
        # Valider le format de version (pour éviter les injections de chemin)
        if not self._is_valid_version(version):
            raise ValueError(f"Format de version invalide: {version}")
        
        # Récupérer le manifeste pour trouver le nom de fichier correct
        manifest_path = await self.get_update_manifest_path(platform)
        if not manifest_path or not os.path.exists(manifest_path):
            raise ValueError(f"Aucun fichier de mise à jour trouvé pour la plateforme {platform}")
        
        try:
            with open(manifest_path, 'r') as f:
                manifest_data = yaml.safe_load(f)
            
            if not manifest_data or "files" not in manifest_data:
                raise ValueError("Informations de fichier manquantes dans le manifeste")
            
            # Trouver le fichier correspondant à la version
            file_info = None
            manifest_version = manifest_data.get("version")
            
            if manifest_version != version:
                raise ValueError(f"Version demandée ({version}) différente de la version disponible ({manifest_version})")
            
            # Récupérer le premier fichier (normalement il n'y en a qu'un par plateforme/version)
            if manifest_data["files"]:
                file_info = manifest_data["files"][0]
            
            if not file_info or "url" not in file_info:
                raise ValueError("URL du fichier manquante dans le manifeste")
            
            # L'URL dans le manifeste est généralement juste le nom du fichier
            filename = file_info["url"]
            file_path = os.path.join(UPDATES_DIR, platform, filename)
            
            if not os.path.exists(file_path):
                raise ValueError(f"Fichier de mise à jour non trouvé: {filename}")
                
            return file_path
        except Exception as e:
            logger.error(f"Erreur lors de la récupération du fichier de mise à jour: {str(e)}")
            raise ValueError(f"Impossible de récupérer le fichier de mise à jour: {str(e)}")
    
    async def publish_new_version(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Publie une nouvelle version en créant les fichiers nécessaires.
        
        Args:
            data: Les données de la nouvelle version
            
        Returns:
            Un dictionnaire avec les informations de la version publiée
        """
        try:
            required_fields = ["version", "platform", "releaseNotes"]
            for field in required_fields:
                if field not in data:
                    raise ValueError(f"Champ requis manquant: {field}")
            
            version = data["version"]
            platform = self._validate_platform(data["platform"])
            
            if not self._is_valid_version(version):
                raise ValueError(f"Format de version invalide: {version}")
            
            # Vérifier si un fichier a été téléchargé
            if "file_path" not in data or not os.path.exists(data["file_path"]):
                raise ValueError("Fichier d'installation manquant ou invalide")
            
            # Copier le fichier d'installation dans le dossier des mises à jour
            dest_dir = os.path.join(UPDATES_DIR, platform)
            file_extension = Path(data["file_path"]).suffix
            
            # Nommer le fichier selon la convention (nom_application-version-plateforme.extension)
            app_name = data.get("app_name", "TwoolLabs")
            dest_filename = f"{app_name}-{version}-{platform}{file_extension}"
            dest_path = os.path.join(dest_dir, dest_filename)
            
            # Copier le fichier
            shutil.copy2(data["file_path"], dest_path)
            
            # Calculer le hash SHA512
            sha512 = self._calculate_file_hash(dest_path, "sha512")
            
            # Créer le manifeste YAML
            manifest_data = {
                "version": version,
                "releaseDate": datetime.now().strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
                "releaseNotes": data["releaseNotes"],
                "files": [
                    {
                        "url": dest_filename,
                        "sha512": sha512,
                        "size": os.path.getsize(dest_path)
                    }
                ]
            }
            
            # Enregistrer le manifeste
            manifest_path = os.path.join(dest_dir, f"latest-{platform}.yml")
            with open(manifest_path, 'w') as f:
                yaml.dump(manifest_data, f, default_flow_style=False)
            
            return {
                "success": True,
                "version": version,
                "platform": platform,
                "file": dest_filename
            }
        except Exception as e:
            logger.error(f"Erreur lors de la publication de la nouvelle version: {str(e)}")
            raise ValueError(f"Impossible de publier la nouvelle version: {str(e)}")
    
    def compare_versions(self, version1: str, version2: str) -> int:
        """
        Compare deux versions sémantiques.
        
        Args:
            version1: Première version
            version2: Deuxième version
            
        Returns:
            -1 si version1 < version2, 0 si égales, 1 si version1 > version2
        """
        if not self._is_valid_version(version1) or not self._is_valid_version(version2):
            raise ValueError("Format de version invalide")
        
        v1_parts = list(map(int, version1.split('.')))
        v2_parts = list(map(int, version2.split('.')))
        
        # Ajouter des zéros si nécessaire pour que les deux listes aient la même longueur
        while len(v1_parts) < len(v2_parts):
            v1_parts.append(0)
        while len(v2_parts) < len(v1_parts):
            v2_parts.append(0)
        
        # Comparer chaque partie
        for i in range(len(v1_parts)):
            if v1_parts[i] < v2_parts[i]:
                return -1
            elif v1_parts[i] > v2_parts[i]:
                return 1
        
        return 0  # Versions égales
    
    def _validate_platform(self, platform: str) -> str:
        """Valide et normalise le nom de la plateforme."""
        valid_platforms = {"win", "mac", "linux"}
        
        platform = platform.lower()
        if platform == "windows":
            platform = "win"
        elif platform == "macos" or platform == "darwin":
            platform = "mac"
        
        if platform not in valid_platforms:
            raise ValueError(f"Plateforme non supportée: {platform}")
        
        return platform
    
    def _is_valid_version(self, version: str) -> bool:
        """Vérifie si une chaîne est au format de version sémantique (x.y.z)."""
        pattern = r'^(\d+)\.(\d+)\.(\d+)$'
        return bool(re.match(pattern, version))
    
    def _calculate_file_hash(self, file_path: str, algorithm: str = "sha256") -> str:
        """Calcule le hash d'un fichier avec l'algorithme spécifié."""
        hash_obj = None
        if algorithm == "sha256":
            hash_obj = hashlib.sha256()
        elif algorithm == "sha512":
            hash_obj = hashlib.sha512()
        else:
            raise ValueError(f"Algorithme de hash non supporté: {algorithm}")
        
        with open(file_path, "rb") as f:
            # Lire par morceaux pour ne pas charger le fichier entier en mémoire
            for chunk in iter(lambda: f.read(4096), b""):
                hash_obj.update(chunk)
        
        return hash_obj.hexdigest()