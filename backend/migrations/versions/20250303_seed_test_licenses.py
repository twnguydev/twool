# alembic/versions/20250305_seed_test_licenses.py
"""seed_test_licenses

Revision ID: 2025030502
Revises: 2025030501
Create Date: 2025-03-05 09:45:00.000000

"""
from alembic import op
import sqlalchemy as sa
from datetime import datetime, timedelta
import uuid
import random
import string

# revision identifiers, used by Alembic.
revision = '2025030502'
down_revision = '2025030501'  # Référence la migration qui modifie la structure de la table
branch_labels = None
depends_on = None

def generate_license_key():
    """Génère une clé de licence au format XXXX-XXXX-XXXX-XXXX-XXXX-XXXX"""
    chars = string.ascii_uppercase + string.digits
    segments = []
    
    for _ in range(6):
        segment = ''.join(random.choice(chars) for _ in range(4))
        segments.append(segment)
    
    return '-'.join(segments)

def upgrade():
    # Date actuelle pour les timestamps
    now = datetime.utcnow()
    future_date = now + timedelta(days=30)  # Pour l'abonnement mensuel
    annual_future = now + timedelta(days=365)  # Pour les abonnements annuels
    
    # Format des dates compatible SQL
    now_str = now.strftime("%Y-%m-%d %H:%M:%S")
    future_str = future_date.strftime("%Y-%m-%d %H:%M:%S")
    annual_future_str = annual_future.strftime("%Y-%m-%d %H:%M:%S")
    
    # Créer des abonnements de test
    ## Abonnement SOLO mensuel
    solo_id = f"sub-{uuid.uuid4().hex[:8]}"
    op.execute(f"""
        INSERT INTO subscriptions (
            id, type, tier, status, start_date, end_date, 
            amount, currency, max_workflows, max_storage, max_users, 
            created_at, updated_at
        ) VALUES (
            '{solo_id}', 'monthly', 'solo', 'active', 
            '{now_str}', '{future_str}', 
            29.0, 'EUR', 3, {500 * 1024}, 1,
            '{now_str}', '{now_str}'
        )
    """)
    
    ## Abonnement BUSINESS annuel
    business_id = f"sub-{uuid.uuid4().hex[:8]}"
    op.execute(f"""
        INSERT INTO subscriptions (
            id, type, tier, status, start_date, end_date, 
            amount, currency, max_workflows, max_storage, max_users, 
            created_at, updated_at
        ) VALUES (
            '{business_id}', 'annual', 'business', 'active', 
            '{now_str}', '{annual_future_str}', 
            990.0, 'EUR', NULL, {5 * 1024 * 1024}, 5,
            '{now_str}', '{now_str}'
        )
    """)
    
    ## Abonnement ENTERPRISE annuel
    enterprise_id = f"sub-{uuid.uuid4().hex[:8]}"
    op.execute(f"""
        INSERT INTO subscriptions (
            id, type, tier, status, start_date, end_date, 
            amount, currency, max_workflows, max_storage, max_users, 
            created_at, updated_at
        ) VALUES (
            '{enterprise_id}', 'annual', 'enterprise', 'active', 
            '{now_str}', '{annual_future_str}', 
            2490.0, 'EUR', NULL, NULL, NULL,
            '{now_str}', '{now_str}'
        )
    """)
    
    # Créer l'abonnement spécifique pour la licence de test
    test_sub_id = "sub-d3d97734"
    test_future = datetime.strptime("2025-04-02 21:48:40.432314", "%Y-%m-%d %H:%M:%S.%f")
    test_now = datetime.strptime("2025-03-03 21:48:40.432314", "%Y-%m-%d %H:%M:%S.%f")
    test_future_str = test_future.strftime("%Y-%m-%d %H:%M:%S")
    test_now_str = test_now.strftime("%Y-%m-%d %H:%M:%S")
    
    op.execute(f"""
        INSERT INTO subscriptions (
            id, type, tier, status, start_date, end_date, 
            amount, currency, max_workflows, max_storage, max_users, 
            created_at, updated_at
        ) VALUES (
            '{test_sub_id}', 'annual', 'business', 'active', 
            '{test_now_str}', '{test_future_str}', 
            990.0, 'EUR', NULL, {5 * 1024 * 1024}, 5,
            '{test_now_str}', '{test_now_str}'
        )
    """)
    
    # Créer des licences pour chaque abonnement selon le format exact spécifié
    # La table a maintenant la structure simplifiée sans les colonnes user_id, activation_date, device_id
    
    # SOLO (1 licence admin)
    solo_lic_id = f"lic-{uuid.uuid4().hex[:8]}"
    solo_key = generate_license_key()
    op.execute(f"""
        INSERT INTO licenses (
            id, `key`, subscription_id, status, expiration_date, is_admin, 
            created_at, updated_at
        ) VALUES (
            '{solo_lic_id}', '{solo_key}', '{solo_id}', 
            'active', '{future_str}', 1,
            '{now_str}', '{now_str}'
        )
    """)
    
    # BUSINESS (1 admin + 2 utilisateurs)
    # Licence Admin
    business_admin_id = f"lic-{uuid.uuid4().hex[:8]}"
    business_admin_key = generate_license_key()
    op.execute(f"""
        INSERT INTO licenses (
            id, `key`, subscription_id, status, expiration_date, is_admin, 
            created_at, updated_at
        ) VALUES (
            '{business_admin_id}', '{business_admin_key}', '{business_id}', 
            'active', '{annual_future_str}', 1,
            '{now_str}', '{now_str}'
        )
    """)
    
    # Licences Utilisateurs Business
    for i in range(2):
        business_user_id = f"lic-{uuid.uuid4().hex[:8]}"
        business_user_key = generate_license_key()
        op.execute(f"""
            INSERT INTO licenses (
                id, `key`, subscription_id, status, expiration_date, is_admin, 
                created_at, updated_at
            ) VALUES (
                '{business_user_id}', '{business_user_key}', '{business_id}', 
                'active', '{annual_future_str}', 0,
                '{now_str}', '{now_str}'
            )
        """)
    
    # ENTERPRISE (1 admin + 4 utilisateurs)
    # Licence Admin
    enterprise_admin_id = f"lic-{uuid.uuid4().hex[:8]}"
    enterprise_admin_key = generate_license_key()
    op.execute(f"""
        INSERT INTO licenses (
            id, `key`, subscription_id, status, expiration_date, is_admin, 
            created_at, updated_at
        ) VALUES (
            '{enterprise_admin_id}', '{enterprise_admin_key}', '{enterprise_id}', 
            'active', '{annual_future_str}', 1,
            '{now_str}', '{now_str}'
        )
    """)
    
    # Licences Utilisateurs Enterprise
    for i in range(4):
        enterprise_user_id = f"lic-{uuid.uuid4().hex[:8]}"
        enterprise_user_key = generate_license_key()
        op.execute(f"""
            INSERT INTO licenses (
                id, `key`, subscription_id, status, expiration_date, is_admin, 
                created_at, updated_at
            ) VALUES (
                '{enterprise_user_id}', '{enterprise_user_key}', '{enterprise_id}', 
                'active', '{annual_future_str}', 0,
                '{now_str}', '{now_str}'
            )
        """)
    
    # Ajouter une licence de test spécifique comme exemple
    op.execute("""
        INSERT INTO licenses (
            id, `key`, subscription_id, status, expiration_date, is_admin, 
            created_at, updated_at
        ) VALUES (
            'lic-166f002c', 'SW12-P884-Q98Z-D8E8-8OOH-U9H2', 'sub-d3d97734', 
            'active', '2025-04-02 21:48:40.432314', 1,
            '2025-03-03 21:48:40.432314', '2025-03-03 21:48:40.432314'
        )
    """)
    
    # Afficher les clés de licence admin pour faciliter les tests
    print("\nLes clés de licence admin pour les tests sont:")
    print(f"- Solo:       {solo_key}")
    print(f"- Business:   {business_admin_key}")
    print(f"- Enterprise: {enterprise_admin_key}")
    print(f"- Test:       SW12-P884-Q98Z-D8E8-8OOH-U9H2")

def downgrade():
    # Supprimer toutes les licences et abonnements créés
    op.execute("DELETE FROM licenses")
    op.execute("DELETE FROM subscriptions")