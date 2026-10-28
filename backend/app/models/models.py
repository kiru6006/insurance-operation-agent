import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Boolean, DateTime, Integer, Float, ForeignKey, JSON, Text
)
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.types import TypeDecorator, CHAR
from app.core.db import Base


# Universal UUID Type that works seamlessly in SQLite & PostgreSQL
class GUID(TypeDecorator):
    """Platform-independent GUID type."""
    impl = CHAR
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == 'postgresql':
            return dialect.type_descriptor(PG_UUID(as_uuid=True))
        else:
            return dialect.type_descriptor(CHAR(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        elif dialect.name == 'postgresql':
            return str(value)
        else:
            if not isinstance(value, uuid.UUID):
                return str(uuid.UUID(str(value)))
            return str(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        if not isinstance(value, uuid.UUID):
            return uuid.UUID(str(value))
        return value


# ============================================================================
# CORE MODELS
# ============================================================================

class Tenant(Base):
    __tablename__ = "tenants"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class User(Base):
    __tablename__ = "users"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(GUID(), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True)
    username = Column(String(100), nullable=False, index=True)
    email = Column(String(255), nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="user", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class Role(Base):
    __tablename__ = "roles"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), unique=True, nullable=False)
    permissions = Column(JSON, default=dict, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class AuditEvent(Base):
    __tablename__ = "audit_events"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(GUID(), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True)
    actor_type = Column(String(50), nullable=False)  # user, agent, system
    actor_id = Column(String(100), nullable=False)
    action = Column(String(100), nullable=False)
    entity_type = Column(String(100), nullable=False)
    entity_id = Column(String(100), nullable=False)
    result = Column(String(50), nullable=False)  # success, failure, denied
    metadata_ = Column("metadata", JSON, default=dict, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)


# ============================================================================
# WORKFLOW MODELS
# ============================================================================

class Workflow(Base):
    __tablename__ = "workflows"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(GUID(), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True)
    workflow_type = Column(String(100), nullable=False)  # submission, claim, service_request
    entity_id = Column(String(100), nullable=False, index=True)
    status = Column(String(50), default="new", nullable=False)  # new, in_progress, pending_approval, completed, rejected
    current_step = Column(String(100), nullable=True)
    metadata_ = Column("metadata", JSON, default=dict, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class WorkflowStep(Base):
    __tablename__ = "workflow_steps"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    workflow_id = Column(GUID(), ForeignKey("workflows.id", ondelete="CASCADE"), nullable=False, index=True)
    step_name = Column(String(100), nullable=False)
    status = Column(String(50), default="pending", nullable=False)
    input_data = Column("input", JSON, default=dict, nullable=True)
    output_data = Column("output", JSON, default=dict, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


# ============================================================================
# AGENT MODELS
# ============================================================================

class Agent(Base):
    __tablename__ = "agents"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(GUID(), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    agent_type = Column(String(100), nullable=False)
    risk_level = Column(String(50), default="low", nullable=False)  # low, medium, high
    status = Column(String(50), default="active", nullable=False)
    config = Column(JSON, default=dict, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class AgentRun(Base):
    __tablename__ = "agent_runs"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(GUID(), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True)
    agent_id = Column(GUID(), ForeignKey("agents.id", ondelete="CASCADE"), nullable=False, index=True)
    workflow_id = Column(GUID(), ForeignKey("workflows.id", ondelete="SET NULL"), nullable=True, index=True)
    input_data = Column(JSON, default=dict, nullable=True)
    output_data = Column(JSON, default=dict, nullable=True)
    status = Column(String(50), default="running", nullable=False)  # running, completed, failed
    error = Column(Text, nullable=True)
    latency_ms = Column(Integer, default=0, nullable=False)
    tokens_used = Column(Integer, default=0, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


# ============================================================================
# TOOLS & PERMISSIONS
# ============================================================================

class Tool(Base):
    __tablename__ = "tools"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    input_schema = Column(JSON, default=dict, nullable=False)
    output_schema = Column(JSON, default=dict, nullable=False)
    risk_level = Column(String(50), default="low", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class ToolPermission(Base):
    __tablename__ = "tool_permissions"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    agent_id = Column(GUID(), ForeignKey("agents.id", ondelete="CASCADE"), nullable=False, index=True)
    tool_id = Column(GUID(), ForeignKey("tools.id", ondelete="CASCADE"), nullable=False, index=True)
    allowed = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


# ============================================================================
# APPROVAL REQUESTS (HUMAN IN THE LOOP)
# ============================================================================

class ApprovalRequest(Base):
    __tablename__ = "approval_requests"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(GUID(), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True)
    workflow_id = Column(GUID(), ForeignKey("workflows.id", ondelete="CASCADE"), nullable=False, index=True)
    agent_run_id = Column(GUID(), ForeignKey("agent_runs.id", ondelete="SET NULL"), nullable=True, index=True)
    assigned_to = Column(String(100), nullable=True)
    action_required = Column(String(255), nullable=False)
    status = Column(String(50), default="pending", nullable=False)  # pending, approved, rejected
    decision_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    decided_at = Column(DateTime, nullable=True)


# ============================================================================
# UNDERWRITING & SUBMISSION
# ============================================================================

class UnderwritingSubmission(Base):
    __tablename__ = "underwriting_submissions"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(GUID(), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True)
    broker_id = Column(String(100), nullable=False)
    applicant_name = Column(String(255), nullable=False)
    line_of_business = Column(String(100), nullable=False)
    status = Column(String(50), default="submitted", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class SubmissionDocument(Base):
    __tablename__ = "submission_documents"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    submission_id = Column(GUID(), ForeignKey("underwriting_submissions.id", ondelete="CASCADE"), nullable=False, index=True)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    document_type = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class SubmissionRisk(Base):
    __tablename__ = "submission_risks"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    submission_id = Column(GUID(), ForeignKey("underwriting_submissions.id", ondelete="CASCADE"), nullable=False, index=True)
    risk_factor = Column(String(255), nullable=False)
    severity = Column(String(50), nullable=False)  # low, medium, high, critical
    evidence = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class SubmissionLineOfBusiness(Base):
    __tablename__ = "submission_lines_of_business"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    submission_id = Column(GUID(), ForeignKey("underwriting_submissions.id", ondelete="CASCADE"), nullable=False, index=True)
    code = Column(String(50), nullable=False)  # GL, PROPERTY, WORKERS_COMP, CYBER, AUTO
    description = Column(String(255), nullable=True)
    requested_limit = Column(Float, default=0.0, nullable=True)
    deductible = Column(Float, default=0.0, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)



# ============================================================================
# CLAIMS
# ============================================================================

class Claim(Base):
    __tablename__ = "claims"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(GUID(), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True)
    policy_id = Column(String(100), nullable=False, index=True)
    customer_id = Column(String(100), nullable=False, index=True)
    incident_date = Column(DateTime, nullable=False)
    status = Column(String(50), default="reported", nullable=False)
    amount_claimed = Column(Float, default=0.0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class ClaimDocument(Base):
    __tablename__ = "claim_documents"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    claim_id = Column(GUID(), ForeignKey("claims.id", ondelete="CASCADE"), nullable=False, index=True)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    document_type = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class ClaimAssessment(Base):
    __tablename__ = "claim_assessments"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    claim_id = Column(GUID(), ForeignKey("claims.id", ondelete="CASCADE"), nullable=False, index=True)
    assessment_type = Column(String(100), nullable=False)
    result = Column(String(100), nullable=False)
    confidence = Column(Float, default=1.0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class FraudSignal(Base):
    __tablename__ = "fraud_signals"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    claim_id = Column(GUID(), ForeignKey("claims.id", ondelete="CASCADE"), nullable=False, index=True)
    signal_type = Column(String(100), nullable=False)
    severity = Column(String(50), nullable=False)  # low, medium, high
    evidence = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


# ============================================================================
# POLICY SERVICE
# ============================================================================

class PolicyServiceRequest(Base):
    __tablename__ = "policy_service_requests"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(GUID(), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True)
    policy_id = Column(String(100), nullable=False, index=True)
    request_type = Column(String(100), nullable=False)  # endorsement, cancellation, certificate, address_change
    status = Column(String(50), default="pending", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
