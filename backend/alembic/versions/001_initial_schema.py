"""001_initial_schema

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-10-28 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001_initial_schema'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Tenants
    op.create_table(
        'tenants',
        sa.Column('id', sa.CHAR(36), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False)
    )

    # Users
    op.create_table(
        'users',
        sa.Column('id', sa.CHAR(36), primary_key=True),
        sa.Column('tenant_id', sa.CHAR(36), sa.ForeignKey('tenants.id', ondelete='CASCADE'), nullable=False),
        sa.Column('username', sa.String(100), nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('role', sa.String(50), nullable=False),
        sa.Column('is_active', sa.Boolean(), default=True, nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False)
    )
    op.create_index('ix_users_tenant_id', 'users', ['tenant_id'])
    op.create_index('ix_users_username', 'users', ['username'])
    op.create_index('ix_users_email', 'users', ['email'])

    # Roles
    op.create_table(
        'roles',
        sa.Column('id', sa.CHAR(36), primary_key=True),
        sa.Column('name', sa.String(100), unique=True, nullable=False),
        sa.Column('permissions', sa.JSON(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False)
    )

    # Audit Events
    op.create_table(
        'audit_events',
        sa.Column('id', sa.CHAR(36), primary_key=True),
        sa.Column('tenant_id', sa.CHAR(36), sa.ForeignKey('tenants.id', ondelete='CASCADE'), nullable=False),
        sa.Column('actor_type', sa.String(50), nullable=False),
        sa.Column('actor_id', sa.String(100), nullable=False),
        sa.Column('action', sa.String(100), nullable=False),
        sa.Column('entity_type', sa.String(100), nullable=False),
        sa.Column('entity_id', sa.String(100), nullable=False),
        sa.Column('result', sa.String(50), nullable=False),
        sa.Column('metadata', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False)
    )
    op.create_index('ix_audit_events_tenant_id', 'audit_events', ['tenant_id'])
    op.create_index('ix_audit_events_created_at', 'audit_events', ['created_at'])

    # Workflows
    op.create_table(
        'workflows',
        sa.Column('id', sa.CHAR(36), primary_key=True),
        sa.Column('tenant_id', sa.CHAR(36), sa.ForeignKey('tenants.id', ondelete='CASCADE'), nullable=False),
        sa.Column('workflow_type', sa.String(100), nullable=False),
        sa.Column('entity_id', sa.String(100), nullable=False),
        sa.Column('status', sa.String(50), nullable=False),
        sa.Column('current_step', sa.String(100), nullable=True),
        sa.Column('metadata', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False)
    )
    op.create_index('ix_workflows_tenant_id', 'workflows', ['tenant_id'])
    op.create_index('ix_workflows_entity_id', 'workflows', ['entity_id'])

    # Workflow Steps
    op.create_table(
        'workflow_steps',
        sa.Column('id', sa.CHAR(36), primary_key=True),
        sa.Column('workflow_id', sa.CHAR(36), sa.ForeignKey('workflows.id', ondelete='CASCADE'), nullable=False),
        sa.Column('step_name', sa.String(100), nullable=False),
        sa.Column('status', sa.String(50), nullable=False),
        sa.Column('input', sa.JSON(), nullable=True),
        sa.Column('output', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False)
    )
    op.create_index('ix_workflow_steps_workflow_id', 'workflow_steps', ['workflow_id'])

    # Agents
    op.create_table(
        'agents',
        sa.Column('id', sa.CHAR(36), primary_key=True),
        sa.Column('tenant_id', sa.CHAR(36), sa.ForeignKey('tenants.id', ondelete='CASCADE'), nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('agent_type', sa.String(100), nullable=False),
        sa.Column('risk_level', sa.String(50), nullable=False),
        sa.Column('status', sa.String(50), nullable=False),
        sa.Column('config', sa.JSON(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False)
    )
    op.create_index('ix_agents_tenant_id', 'agents', ['tenant_id'])

    # Agent Runs
    op.create_table(
        'agent_runs',
        sa.Column('id', sa.CHAR(36), primary_key=True),
        sa.Column('tenant_id', sa.CHAR(36), sa.ForeignKey('tenants.id', ondelete='CASCADE'), nullable=False),
        sa.Column('agent_id', sa.CHAR(36), sa.ForeignKey('agents.id', ondelete='CASCADE'), nullable=False),
        sa.Column('workflow_id', sa.CHAR(36), sa.ForeignKey('workflows.id', ondelete='SET NULL'), nullable=True),
        sa.Column('input_data', sa.JSON(), nullable=True),
        sa.Column('output_data', sa.JSON(), nullable=True),
        sa.Column('status', sa.String(50), nullable=False),
        sa.Column('error', sa.Text(), nullable=True),
        sa.Column('latency_ms', sa.Integer(), nullable=False),
        sa.Column('tokens_used', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False)
    )
    op.create_index('ix_agent_runs_tenant_id', 'agent_runs', ['tenant_id'])
    op.create_index('ix_agent_runs_agent_id', 'agent_runs', ['agent_id'])
    op.create_index('ix_agent_runs_workflow_id', 'agent_runs', ['workflow_id'])

    # Tools
    op.create_table(
        'tools',
        sa.Column('id', sa.CHAR(36), primary_key=True),
        sa.Column('name', sa.String(100), unique=True, nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('input_schema', sa.JSON(), nullable=False),
        sa.Column('output_schema', sa.JSON(), nullable=False),
        sa.Column('risk_level', sa.String(50), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False)
    )

    # Tool Permissions
    op.create_table(
        'tool_permissions',
        sa.Column('id', sa.CHAR(36), primary_key=True),
        sa.Column('agent_id', sa.CHAR(36), sa.ForeignKey('agents.id', ondelete='CASCADE'), nullable=False),
        sa.Column('tool_id', sa.CHAR(36), sa.ForeignKey('tools.id', ondelete='CASCADE'), nullable=False),
        sa.Column('allowed', sa.Boolean(), default=True, nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False)
    )
    op.create_index('ix_tool_permissions_agent_id', 'tool_permissions', ['agent_id'])
    op.create_index('ix_tool_permissions_tool_id', 'tool_permissions', ['tool_id'])

    # Approval Requests
    op.create_table(
        'approval_requests',
        sa.Column('id', sa.CHAR(36), primary_key=True),
        sa.Column('tenant_id', sa.CHAR(36), sa.ForeignKey('tenants.id', ondelete='CASCADE'), nullable=False),
        sa.Column('workflow_id', sa.CHAR(36), sa.ForeignKey('workflows.id', ondelete='CASCADE'), nullable=False),
        sa.Column('agent_run_id', sa.CHAR(36), sa.ForeignKey('agent_runs.id', ondelete='SET NULL'), nullable=True),
        sa.Column('assigned_to', sa.String(100), nullable=True),
        sa.Column('action_required', sa.String(255), nullable=False),
        sa.Column('status', sa.String(50), nullable=False),
        sa.Column('decision_reason', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('decided_at', sa.DateTime(), nullable=True)
    )
    op.create_index('ix_approval_requests_tenant_id', 'approval_requests', ['tenant_id'])
    op.create_index('ix_approval_requests_workflow_id', 'approval_requests', ['workflow_id'])

    # Underwriting Submissions
    op.create_table(
        'underwriting_submissions',
        sa.Column('id', sa.CHAR(36), primary_key=True),
        sa.Column('tenant_id', sa.CHAR(36), sa.ForeignKey('tenants.id', ondelete='CASCADE'), nullable=False),
        sa.Column('broker_id', sa.String(100), nullable=False),
        sa.Column('applicant_name', sa.String(255), nullable=False),
        sa.Column('line_of_business', sa.String(100), nullable=False),
        sa.Column('status', sa.String(50), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False)
    )
    op.create_index('ix_underwriting_submissions_tenant_id', 'underwriting_submissions', ['tenant_id'])

    # Submission Documents
    op.create_table(
        'submission_documents',
        sa.Column('id', sa.CHAR(36), primary_key=True),
        sa.Column('submission_id', sa.CHAR(36), sa.ForeignKey('underwriting_submissions.id', ondelete='CASCADE'), nullable=False),
        sa.Column('file_name', sa.String(255), nullable=False),
        sa.Column('file_path', sa.String(500), nullable=False),
        sa.Column('document_type', sa.String(100), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False)
    )
    op.create_index('ix_submission_documents_submission_id', 'submission_documents', ['submission_id'])

    # Submission Risks
    op.create_table(
        'submission_risks',
        sa.Column('id', sa.CHAR(36), primary_key=True),
        sa.Column('submission_id', sa.CHAR(36), sa.ForeignKey('underwriting_submissions.id', ondelete='CASCADE'), nullable=False),
        sa.Column('risk_factor', sa.String(255), nullable=False),
        sa.Column('severity', sa.String(50), nullable=False),
        sa.Column('evidence', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False)
    )
    op.create_index('ix_submission_risks_submission_id', 'submission_risks', ['submission_id'])

    # Claims
    op.create_table(
        'claims',
        sa.Column('id', sa.CHAR(36), primary_key=True),
        sa.Column('tenant_id', sa.CHAR(36), sa.ForeignKey('tenants.id', ondelete='CASCADE'), nullable=False),
        sa.Column('policy_id', sa.String(100), nullable=False),
        sa.Column('customer_id', sa.String(100), nullable=False),
        sa.Column('incident_date', sa.DateTime(), nullable=False),
        sa.Column('status', sa.String(50), nullable=False),
        sa.Column('amount_claimed', sa.Float(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False)
    )
    op.create_index('ix_claims_tenant_id', 'claims', ['tenant_id'])
    op.create_index('ix_claims_policy_id', 'claims', ['policy_id'])
    op.create_index('ix_claims_customer_id', 'claims', ['customer_id'])

    # Claim Documents
    op.create_table(
        'claim_documents',
        sa.Column('id', sa.CHAR(36), primary_key=True),
        sa.Column('claim_id', sa.CHAR(36), sa.ForeignKey('claims.id', ondelete='CASCADE'), nullable=False),
        sa.Column('file_name', sa.String(255), nullable=False),
        sa.Column('file_path', sa.String(500), nullable=False),
        sa.Column('document_type', sa.String(100), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False)
    )
    op.create_index('ix_claim_documents_claim_id', 'claim_documents', ['claim_id'])

    # Claim Assessments
    op.create_table(
        'claim_assessments',
        sa.Column('id', sa.CHAR(36), primary_key=True),
        sa.Column('claim_id', sa.CHAR(36), sa.ForeignKey('claims.id', ondelete='CASCADE'), nullable=False),
        sa.Column('assessment_type', sa.String(100), nullable=False),
        sa.Column('result', sa.String(100), nullable=False),
        sa.Column('confidence', sa.Float(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False)
    )
    op.create_index('ix_claim_assessments_claim_id', 'claim_assessments', ['claim_id'])

    # Fraud Signals
    op.create_table(
        'fraud_signals',
        sa.Column('id', sa.CHAR(36), primary_key=True),
        sa.Column('claim_id', sa.CHAR(36), sa.ForeignKey('claims.id', ondelete='CASCADE'), nullable=False),
        sa.Column('signal_type', sa.String(100), nullable=False),
        sa.Column('severity', sa.String(50), nullable=False),
        sa.Column('evidence', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False)
    )
    op.create_index('ix_fraud_signals_claim_id', 'fraud_signals', ['claim_id'])

    # Policy Service Requests
    op.create_table(
        'policy_service_requests',
        sa.Column('id', sa.CHAR(36), primary_key=True),
        sa.Column('tenant_id', sa.CHAR(36), sa.ForeignKey('tenants.id', ondelete='CASCADE'), nullable=False),
        sa.Column('policy_id', sa.String(100), nullable=False),
        sa.Column('request_type', sa.String(100), nullable=False),
        sa.Column('status', sa.String(50), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False)
    )
    op.create_index('ix_policy_service_requests_tenant_id', 'policy_service_requests', ['tenant_id'])
    op.create_index('ix_policy_service_requests_policy_id', 'policy_service_requests', ['policy_id'])


def downgrade():
    op.drop_table('policy_service_requests')
    op.drop_table('fraud_signals')
    op.drop_table('claim_assessments')
    op.drop_table('claim_documents')
    op.drop_table('claims')
    op.drop_table('submission_risks')
    op.drop_table('submission_documents')
    op.drop_table('underwriting_submissions')
    op.drop_table('approval_requests')
    op.drop_table('tool_permissions')
    op.drop_table('tools')
    op.drop_table('agent_runs')
    op.drop_table('agents')
    op.drop_table('workflow_steps')
    op.drop_table('workflows')
    op.drop_table('audit_events')
    op.drop_table('roles')
    op.drop_table('users')
    op.drop_table('tenants')
