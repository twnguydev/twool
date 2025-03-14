"""Initial database schema

Revision ID: 2025030108
Revises: 
Create Date: 2025-03-01 08:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '2025030108'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('processes',
        sa.Column('id', sa.String(length=50), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('nodes', mysql.JSON(), nullable=False),
        sa.Column('edges', mysql.JSON(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    
    op.create_table('simulations',
        sa.Column('id', sa.String(length=50), nullable=False),
        sa.Column('process_id', sa.String(length=50), nullable=False),
        sa.Column('status', sa.Enum('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', name='simulationstatus'), nullable=False),
        sa.Column('parameters', mysql.JSON(), nullable=True),
        sa.Column('metrics', mysql.JSON(), nullable=True),
        sa.Column('details', mysql.JSON(), nullable=True),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['process_id'], ['processes.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    op.create_table('flow_ia_analyses',
        sa.Column('id', sa.String(length=50), nullable=False),
        sa.Column('process_id', sa.String(length=50), nullable=False),
        sa.Column('model_analysis', mysql.JSON(), nullable=True),
        sa.Column('flow_analysis', mysql.JSON(), nullable=True),
        sa.Column('critical_variables', mysql.JSON(), nullable=True),
        sa.Column('bottlenecks', mysql.JSON(), nullable=True),
        sa.Column('optimizations', mysql.JSON(), nullable=True),
        sa.Column('alternative_scenarios', mysql.JSON(), nullable=True),
        sa.Column('resilience_assessment', mysql.JSON(), nullable=True),
        sa.Column('confidence_score', sa.Float(), nullable=True),
        sa.Column('visualization_suggestions', mysql.JSON(), nullable=True),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['process_id'], ['processes.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    op.create_table('optimizations',
        sa.Column('id', sa.String(length=50), nullable=False),
        sa.Column('process_id', sa.String(length=50), nullable=False),
        sa.Column('simulation_id', sa.String(length=50), nullable=True),
        sa.Column('status', sa.Enum('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', name='optimizationstatus'), nullable=False),
        sa.Column('parameters', mysql.JSON(), nullable=True),
        sa.Column('suggestions', mysql.JSON(), nullable=True),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['process_id'], ['processes.id'], ),
        sa.ForeignKeyConstraint(['simulation_id'], ['simulations.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    op.create_index('idx_process_id', 'flow_ia_analyses', ['process_id'], unique=False)
    op.create_index('idx_created_at', 'flow_ia_analyses', ['created_at'], unique=False)
    op.create_index('idx_process_id', 'optimizations', ['process_id'], unique=False)
    op.create_index('idx_simulation_id', 'optimizations', ['simulation_id'], unique=False)
    op.create_index('idx_process_id', 'simulations', ['process_id'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # D'abord supprimer les contraintes de clé étrangère
    op.drop_constraint('optimizations_ibfk_1', 'optimizations', type_='foreignkey')
    op.drop_constraint('optimizations_ibfk_2', 'optimizations', type_='foreignkey')
    op.drop_constraint('flow_ia_analyses_ibfk_1', 'flow_ia_analyses', type_='foreignkey')
    op.drop_constraint('simulations_ibfk_1', 'simulations', type_='foreignkey')
    
    # Ensuite supprimer les index
    op.drop_index('idx_process_id', table_name='simulations')
    op.drop_index('idx_simulation_id', table_name='optimizations')
    op.drop_index('idx_process_id', table_name='optimizations')
    op.drop_index('idx_created_at', table_name='flow_ia_analyses')
    op.drop_index('idx_process_id', table_name='flow_ia_analyses')
    
    # Enfin supprimer les tables
    op.drop_table('optimizations')
    op.drop_table('flow_ia_analyses')
    op.drop_table('simulations')
    op.drop_table('processes')