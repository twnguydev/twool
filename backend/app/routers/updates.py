from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import FileResponse
from typing import Optional, Dict, Any
import os
from pathlib import Path
import yaml
import json

from ..services.update_service import UpdateService
from ..config import get_settings

router = APIRouter()

settings = get_settings()


@router.get("", summary="Obtenir les informations sur la dernière mise à jour")
async def get_latest_update(
    platform: str = "win", 
    current_version: Optional[str] = None,
    update_service: UpdateService = Depends()
):
    """
    Récupérer les informations sur la dernière mise à jour disponible.
    
    - **platform**: Plateforme cible (win, mac, linux)
    - **current_version**: Version actuelle de l'application
    """
    try:
        update_info = await update_service.get_latest_version(platform)
        
        # Si la version actuelle est fournie, vérifier si une mise à jour est nécessaire
        if current_version and update_service.compare_versions(current_version, update_info["version"]) >= 0:
            # La version actuelle est à jour ou plus récente
            return {"update_available": False, "current_version": current_version}
        
        return {
            "update_available": True,
            "version": update_info["version"],
            "release_notes": update_info.get("notes", ""),
            "publish_date": update_info.get("publish_date", ""),
            "download_url": f"/api/updates/download/{platform}/{update_info['version']}"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Informations de mise à jour non disponibles: {str(e)}"
        )


@router.get("/latest-{platform}.yml", summary="Obtenir le fichier YAML de mise à jour")
async def get_update_manifest(platform: str, update_service: UpdateService = Depends()):
    """
    Récupérer le fichier YAML de mise à jour pour Electron Updater.
    
    - **platform**: Plateforme cible (win, mac, linux)
    """
    try:
        file_path = await update_service.get_update_manifest_path(platform)
        if not file_path or not os.path.exists(file_path):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Fichier de mise à jour non trouvé pour la plateforme {platform}"
            )
        
        return FileResponse(file_path, media_type="application/x-yaml")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la récupération du fichier de mise à jour: {str(e)}"
        )


@router.get("/download/{platform}/{version}", summary="Télécharger un fichier de mise à jour")
async def download_update(
    platform: str, 
    version: str,
    update_service: UpdateService = Depends()
):
    """
    Télécharger le fichier d'installation de la mise à jour.
    
    - **platform**: Plateforme cible (win, mac, linux)
    - **version**: Version à télécharger
    """
    try:
        file_path = await update_service.get_update_file_path(platform, version)
        if not file_path or not os.path.exists(file_path):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Fichier de mise à jour non trouvé pour {platform} version {version}"
            )
        
        # Déterminer le type de média en fonction de l'extension du fichier
        media_type = "application/octet-stream"
        file_extension = Path(file_path).suffix.lower()
        
        if file_extension == ".exe":
            media_type = "application/vnd.microsoft.portable-executable"
        elif file_extension == ".dmg":
            media_type = "application/x-apple-diskimage"
        elif file_extension == ".deb":
            media_type = "application/vnd.debian.binary-package"
        elif file_extension == ".appimage":
            media_type = "application/x-appimage"
        elif file_extension == ".zip":
            media_type = "application/zip"
        
        return FileResponse(
            file_path, 
            media_type=media_type,
            filename=os.path.basename(file_path)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors du téléchargement de la mise à jour: {str(e)}"
        )


@router.post("/admin/publish", summary="Publier une nouvelle version (administrateurs uniquement)")
async def publish_update(
    request: Request,
    update_service: UpdateService = Depends()
):
    """
    Publier une nouvelle version (réservé aux administrateurs).
    
    Le corps de la requête doit contenir les informations sur la nouvelle version.
    """
    # Vérification des permissions administrateur (à implémenter)
    # TODO: Ajouter la vérification d'authentification et d'autorisation
    
    try:
        data = await request.json()
        result = await update_service.publish_new_version(data)
        return {"success": True, "version": result["version"]}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la publication de la mise à jour: {str(e)}"
        )