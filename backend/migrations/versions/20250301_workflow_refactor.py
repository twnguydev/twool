"""Refactor to simplify with direct workflow model

Revision ID: 2025030110
Revises: 2025030109
Create Date: 2025-03-01 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '2025030110'
down_revision = '2025030109'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    
    # Ajouter client_created_at à la table workflows
    op.add_column('workflows', sa.Column('client_created_at', sa.DateTime(), nullable=True))
    
    # Ajouter les colonnes nodes et edges à la table workflows (d'abord autorisées à être NULL)
    op.add_column('workflows', sa.Column('nodes', mysql.JSON(), nullable=True))
    op.add_column('workflows', sa.Column('edges', mysql.JSON(), nullable=True))
    
    # Exécuter des instructions SQL brutes pour mettre à jour les valeurs existantes
    op.execute("UPDATE workflows SET nodes = '[]' WHERE nodes IS NULL")
    op.execute("UPDATE workflows SET edges = '[]' WHERE edges IS NULL")
    
    # Puis modifier les colonnes pour les rendre NOT NULL en spécifiant explicitement le type
    op.alter_column('workflows', 'nodes', 
                   existing_type=mysql.JSON(),
                   nullable=False)
    op.alter_column('workflows', 'edges', 
                   existing_type=mysql.JSON(),
                   nullable=False)
    
    # Mettre à jour les relations dans les tables dépendantes
    
    # 1. Créer des colonnes temporaires workflow_id dans les tables dépendantes
    op.add_column('simulations', sa.Column('workflow_id', sa.String(length=50), nullable=True))
    op.add_column('optimizations', sa.Column('workflow_id', sa.String(length=50), nullable=True))
    op.add_column('flow_ia_analyses', sa.Column('workflow_id', sa.String(length=50), nullable=True))
    
    # 2. Ajouter des migrations personnalisées pour copier les données du modèle process vers workflow
    # Cette partie nécessiterait une migration de données personnalisée que nous simulons ici
    # Dans un environnement réel, vous devriez migrer les données de processes vers workflows
    
    # 3. Mettre à jour les clés étrangères pour pointer vers workflow_id
    op.create_foreign_key('fk_simulations_workflow', 'simulations', 'workflows', ['workflow_id'], ['id'])
    op.create_foreign_key('fk_optimizations_workflow', 'optimizations', 'workflows', ['workflow_id'], ['id'])
    op.create_foreign_key('fk_flow_ia_analyses_workflow', 'flow_ia_analyses', 'workflows', ['workflow_id'], ['id'])
    
    # 4. Supprimer les anciennes colonnes et relations
    op.drop_constraint('fk_process_workflow', 'processes', type_='foreignkey')
    op.drop_constraint('simulations_ibfk_1', 'simulations', type_='foreignkey')
    op.drop_constraint('optimizations_ibfk_1', 'optimizations', type_='foreignkey')
    op.drop_constraint('flow_ia_analyses_ibfk_1', 'flow_ia_analyses', type_='foreignkey')
    
    op.drop_column('simulations', 'process_id')
    op.drop_column('optimizations', 'process_id')
    op.drop_column('flow_ia_analyses', 'process_id')
    
    # 5. Rendre les nouvelles colonnes workflow_id NOT NULL
    op.alter_column('simulations', 'workflow_id', 
                    existing_type=sa.String(length=50),
                    nullable=False)
    op.alter_column('optimizations', 'workflow_id', 
                    existing_type=sa.String(length=50),
                    nullable=False)
    op.alter_column('flow_ia_analyses', 'workflow_id', 
                    existing_type=sa.String(length=50),
                    nullable=False)
    
    # 6. Créer les index pour les nouvelles colonnes
    op.create_index('idx_simulations_workflow', 'simulations', ['workflow_id'], unique=False)
    op.create_index('idx_optimizations_workflow', 'optimizations', ['workflow_id'], unique=False)
    op.create_index('idx_flow_ia_analyses_workflow', 'flow_ia_analyses', ['workflow_id'], unique=False)
    
    # 7. Supprimer la table processes qui n'est plus nécessaire
    op.drop_table('processes')
    
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    
    # 1. Recréer la table processes
    op.create_table('processes',
        sa.Column('id', sa.String(length=50), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('nodes', mysql.JSON(), nullable=False),
        sa.Column('edges', mysql.JSON(), nullable=False),
        sa.Column('workflow_id', sa.String(length=50), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['workflow_id'], ['workflows.id'], name='fk_process_workflow'),
        sa.PrimaryKeyConstraint('id')
    )
    
    # 2. Créer des colonnes temporaires process_id dans les tables dépendantes
    op.alter_column('simulations', 'process_id', 
                    existing_type=sa.String(length=50),
                    nullable=False)
    op.alter_column('optimizations', 'process_id', 
                    existing_type=sa.String(length=50),
                    nullable=False)
    op.alter_column('flow_ia_analyses', 'process_id', 
                    existing_type=sa.String(length=50),
                    nullable=False)
    
    # 3. Migration pour générer des processes pour chaque workflow et mettre à jour les références
    # Cette partie nécessiterait une migration de données personnalisée
    
    # 4. Mettre à jour les clés étrangères
    op.create_foreign_key('simulations_ibfk_1', 'simulations', 'processes', ['process_id'], ['id'])
    op.create_foreign_key('optimizations_ibfk_1', 'optimizations', 'processes', ['process_id'], ['id'])
    op.create_foreign_key('flow_ia_analyses_ibfk_1', 'flow_ia_analyses', 'processes', ['process_id'], ['id'])
    
    # 5. Supprimer les colonnes workflow_id
    op.drop_constraint('fk_simulations_workflow', 'simulations', type_='foreignkey')
    op.drop_constraint('fk_optimizations_workflow', 'optimizations', type_='foreignkey')
    op.drop_constraint('fk_flow_ia_analyses_workflow', 'flow_ia_analyses', type_='foreignkey')
    
    op.drop_index('idx_simulations_workflow', 'simulations')
    op.drop_index('idx_optimizations_workflow', 'optimizations')
    op.drop_index('idx_flow_ia_analyses_workflow', 'flow_ia_analyses')
    
    op.drop_column('simulations', 'workflow_id')
    op.drop_column('optimizations', 'workflow_id')
    op.drop_column('flow_ia_analyses', 'workflow_id')
    
    # 6. Rendre les colonnes process_id NOT NULL
    op.alter_column('simulations', 'process_id', nullable=False)
    op.alter_column('optimizations', 'process_id', nullable=False)
    op.alter_column('flow_ia_analyses', 'process_id', nullable=False)
    
    # 7. Supprimer les colonnes nodes et edges de workflows
    op.drop_column('workflows', 'nodes')
    op.drop_column('workflows', 'edges')
    op.drop_column('workflows', 'client_created_at')
    
    # ### end Alembic commands ###