import os
import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from jinja2 import Environment, FileSystemLoader
import jwt
from datetime import datetime, timedelta, timezone

from app.config import settings

logger = logging.getLogger(__name__)

class EmailService:
    @staticmethod
    def send_email(to_email, subject, template_name, context=None):
        """
        Envoie un email en utilisant un template Jinja2
        
        Args:
            to_email (str): Adresse email du destinataire
            subject (str): Sujet de l'email
            template_name (str): Nom du fichier template (sans l'extension)
            context (dict, optional): Variables de contexte pour le template
        
        Returns:
            bool: True si l'envoi a réussi, False sinon
        """
        if context is None:
            context = {}
        
        try:
            logger.info(f"Préparation de l'envoi d'email à {to_email}, sujet: {subject}")
            logger.info(f"Utilisation du template: {template_name}")
            
            # Configuration de Jinja2
            template_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'templates', 'emails')
            env = Environment(loader=FileSystemLoader(template_dir))
            template = env.get_template(f"{template_name}.html")
            
            # Rendu du template avec le contexte
            html_content = template.render(**context)
            
            # Création du message
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = settings.SMTP_FROM
            message["To"] = to_email
            
            # Ajout du contenu HTML
            part = MIMEText(html_content, "html")
            message.attach(part)
            
            # Envoi de l'email
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                server.starttls()
                if settings.SMTP_USER and settings.SMTP_PASSWORD:
                    server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                
                server.set_debuglevel(1)
                server.sendmail(settings.SMTP_FROM, to_email, message.as_string())
            
            logger.info(f"Email envoyé avec succès à {to_email}, sujet: {subject}")
            return True
            
        except Exception as e:
          logger.error(f"Échec de l'envoi d'email à {to_email}", exc_info=True)
          logger.error(f"Erreur détaillée: {str(e)}")
          return False
    
    @staticmethod
    def send_verification_email(user):
        """
        Envoie un email de vérification à un utilisateur
        
        Args:
            user: L'objet utilisateur
            
        Returns:
            bool: True si l'envoi a réussi, False sinon
        """
        # Générer un token de vérification
        token_data = {
            "user_id": user.id,
            "email": user.email,
            "exp": datetime.now(timezone.utc) + timedelta(hours=24)  # Expiration dans 24h
        }
        
        verification_token = jwt.encode(
            token_data,
            settings.SECRET_KEY,
            algorithm="HS256"
        )
        
        # URL de vérification
        verification_url = f"{settings.FRONTEND_URL}/auth/verify-email?token={verification_token}"
        
        # Contexte pour le template
        context = {
            "first_name": user.first_name,
            "verification_url": verification_url,
            "company_name": "Twool Labs",
            "support_email": settings.SMTP_FROM,
            "expiration_hours": 24
        }
        
        # Envoi de l'email
        return EmailService.send_email(
            user.email,
            "Confirmez votre adresse email - Twool Labs",
            "email_verification",
            context
        )
    
    @staticmethod
    def verify_email_token(token):
        """
        Vérifie un token de vérification d'email
        
        Args:
            token (str): Le token JWT
            
        Returns:
            dict: Les données du token si valide, None sinon
        """
        try:
            token_data = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            return token_data
        except jwt.ExpiredSignatureError:
            logger.warning("Token de vérification d'email expiré")
            return None
        except jwt.InvalidTokenError:
            logger.warning("Token de vérification d'email invalide")
            return None