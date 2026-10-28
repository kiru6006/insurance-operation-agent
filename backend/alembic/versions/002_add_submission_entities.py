"""002_add_submission_entities

Revision ID: 002_add_submission_entities
Revises: 001_initial_schema
Create Date: 2026-10-28 14:30:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '002_add_submission_entities'
down_revision = '001_initial_schema'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'submission_lines_of_business',
        sa.Column('id', sa.CHAR(36), primary_key=True),
        sa.Column('submission_id', sa.CHAR(36), sa.ForeignKey('underwriting_submissions.id', ondelete='CASCADE'), nullable=False),
        sa.Column('code', sa.String(50), nullable=False),
        sa.Column('description', sa.String(255), nullable=True),
        sa.Column('requested_limit', sa.Float(), default=0.0, nullable=True),
        sa.Column('deductible', sa.Float(), default=0.0, nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False)
    )
    op.create_index('ix_submission_lines_of_business_submission_id', 'submission_lines_of_business', ['submission_id'])


def downgrade():
    op.drop_table('submission_lines_of_business')
