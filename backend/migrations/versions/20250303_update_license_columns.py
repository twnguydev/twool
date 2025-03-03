# alembic/versions/20250305_update_license_columns.py
"""update_license_columns

Revision ID: 2025030501
Revises: 2025030110
Create Date: 2025-03-05 09:30:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '2025030501'
down_revision = '2025030110'  # Référence la migration précédente
branch_labels = None
depends_on = None

def upgrade():
    # Supprimer les contraintes de clé étrangère sur user_id
    op.drop_constraint('licenses_ibfk_2', 'licenses', type_='foreignkey')
    
    # Supprimer les colonnes user_id, activation_date et device_id
    op.drop_column('licenses', 'user_id')
    op.drop_column('licenses', 'activation_date')
    op.drop_column('licenses', 'device_id')

def downgrade():
    # Recréer les colonnes supprimées
    op.add_column('licenses', sa.Column('user_id', sa.String(length=50), nullable=True))
    op.add_column('licenses', sa.Column('activation_date', sa.DateTime(), nullable=True))
    op.add_column('licenses', sa.Column('device_id', sa.String(length=255), nullable=True))
    
    # Recréer la contrainte de clé étrangère
    op.create_foreign_key('licenses_ibfk_2', 'licenses', 'users', ['user_id'], ['id'])