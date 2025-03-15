from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from typing import Optional
import os
import shutil
from tempfile import NamedTemporaryFile
from pathlib import Path

from ..services.update_service import UpdateService
from ..config import get_settings

router = APIRouter()

settings = get_settings()


@router.post("/upload", summary="Téléverser un fichier d'installation")
async def upload_installation_file(
    file: UploadFile = File(...),
    version: str = Form(...),
    platform: str = Form(...),
    release_notes: str = Form(...),
    app_name: str = Form("TwoolLabs"),
    update_service: UpdateService = Depends()
):
    """
    Téléverse un fichier d'installation pour une nouvelle version.
    
    - **file**: Le fichier d'installation à téléverser
    - **version**: Numéro de version au format x.y.z
    - **platform**: Plateforme (win, mac, linux)
    - **release_notes**: Notes de version
    - **app_name**: Nom de l'application
    """
    try:
        # Valider le format de version
        if not update_service._is_valid_version(version):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Format de version invalide. Utilisez le format x.y.z"
            )
        
        # Valider la plateforme
        try:
            platform = update_service._validate_platform(platform)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
        
        # Vérifier la taille du fichier
        content_length = 0
        if "content-length" in file.headers:
            content_length = int(file.headers["content-length"])
            if content_length > settings.max_upload_size:
                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail=f"Le fichier est trop volumineux. Taille maximale: {settings.max_upload_size / (1024 * 1024)} MB"
                )
        
        # Créer un fichier temporaire
        suffix = Path(file.filename).suffix
        with NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            # Copier le contenu du fichier téléversé dans le fichier temporaire
            shutil.copyfileobj(file.file, temp_file)
            temp_file_path = temp_file.name
        
        try:
            # Préparer les données pour la publication
            data = {
                "version": version,
                "platform": platform,
                "releaseNotes": release_notes,
                "app_name": app_name,
                "file_path": temp_file_path
            }
            
            # Publier la nouvelle version
            result = await update_service.publish_new_version(data)
            
            return {
                "success": True,
                "message": f"Version {version} publiée avec succès pour la plateforme {platform}",
                "version": version,
                "platform": platform,
                "file": result.get("file", "")
            }
        finally:
            # Supprimer le fichier temporaire
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors du téléversement du fichier: {str(e)}"
        )