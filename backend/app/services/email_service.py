import os
import logging
import smtplib
import uuid  # Pour générer un Message-ID unique
import email.utils  # Pour le formatage de date
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
            
            # Ajout d'en-têtes supplémentaires pour améliorer la délivrabilité
            message["Message-ID"] = f"<{uuid.uuid4()}@{settings.SMTP_FROM.split('@')[1]}>"
            message["Date"] = email.utils.formatdate(localtime=True)
            message["Content-Language"] = "fr"
            
            # Création d'une version texte du contenu HTML
            # Version simple pour les tests
            text_content = f"""
Bonjour {context.get('first_name', '')},

Merci de vous être inscrit à Twool Labs ! Pour finaliser votre inscription, veuillez confirmer votre adresse email en cliquant sur le lien ci-dessous :

{context.get('verification_url', '')}

Ce lien expirera dans {context.get('expiration_hours', 24)} heures.

Cordialement,
L'équipe Twool Labs
"""
            # Ajout de la version texte en premier (important pour la compatibilité)
            text_part = MIMEText(text_content, "plain", "utf-8")
            message.attach(text_part)
            
            # Ajout du contenu HTML (après la version texte)
            html_part = MIMEText(html_content, "html", "utf-8")
            message.attach(html_part)
            
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
        
        # URL de vérification (utiliser une URL publique si possible)
        verification_url = f"{settings.FRONTEND_URL}/auth/verify-email?token={verification_token}"
        
        # Contexte pour le template
        context = {
            "first_name": user.first_name,
            "verification_url": verification_url,
            "company_name": "Twool Labs",
            "support_email": settings.SMTP_FROM,
            "expiration_hours": 24,
            "current_year": datetime.now().year
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
    
    @staticmethod
    def test_direct_smtp():
        import smtplib
        from email.mime.text import MIMEText
        
        # Message simple
        msg = MIMEText("Ceci est un test d'envoi direct")
        msg["Subject"] = "Test SMTP direct"
        msg["From"] = settings.SMTP_FROM
        msg["To"] = "gibratanguy@icloud.com"
        
        # Connexion sans framework
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.set_debuglevel(2)  # Debug plus verbeux
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_FROM, "gibratanguy@icloud.com", msg.as_string())