# INSUREOPS AI
## Agentic Insurance Workflow Operating Layer

You are operating inside Antigravity IDE as a senior engineering team consisting of:

- Principal Software Architect
- Insurance Domain Architect
- Senior Business Analyst
- Staff Full-Stack Engineer
- AI/Agent Architect
- Data Architect
- Security Architect
- UX Architect
- QA Architect

Your task is to BUILD the application, not merely describe it.

The product is:

# InsureOps AI

> An agentic insurance workflow operating layer that connects existing insurance systems, understands unstructured work, automates repetitive workflows, assists human decisions, and provides complete governance and auditability.

---

# 1. CRITICAL INSTRUCTION

Do NOT build a generic AI chatbot.

Do NOT build a collection of disconnected AI agents.

Do NOT create a static UI prototype.

Do NOT hard-code fake AI responses into React components.

Build a real full-stack application with:

- Frontend
- Backend
- Database
- Authentication
- RBAC
- Workflow engine
- Agent orchestration
- AI abstraction
- RAG
- Rules engine
- Tool/MCP abstraction
- Human approval
- Audit trail
- Agent observability
- Workflow analytics
- Realistic mock insurance systems
- Seed data
- Automated tests

The architecture must be ready to connect to real insurance systems later.

---

# 2. PRODUCT PRINCIPLE

The product must optimize for:

> Valuable human work eliminated without increasing insurance risk.

Do NOT optimize for:

- Number of agents
- Number of LLM calls
- Maximum autonomy
- Chatbot functionality

Optimize for:

- Processing time reduction
- Manual steps eliminated
- Duplicate data entry eliminated
- SLA improvement
- Human workload reduction
- Claims throughput
- Underwriting throughput
- Operational cost reduction
- Decision quality
- Auditability
- Human oversight

---

# 3. MVP SCOPE

Do NOT attempt to build 30 agents initially.

Build THREE complete insurance workflows.

## Workflow 1

### Commercial Insurance Submission → Underwriting Decision Preparation

## Workflow 2

### Claim → Adjuster Decision Package

## Workflow 3

### Policy Service Request → Resolution

These workflows must use shared platform capabilities.

---

# 4. HIGH-LEVEL ARCHITECTURE

Build:

```text
                    INSUREOPS AI
                         |
                 Workflow Orchestrator
                         |
       ┌─────────────────┼─────────────────┐
       |                 |                 |
 Commercial          Claims            Policy
 Submission          Decision          Servicing
       |                 |                 |
       └─────────────────┼─────────────────┘
                         |
                  Shared AI Platform
                         |
       ┌─────────────────┼─────────────────┐
       |                 |                 |
   Documents            RAG              Rules
       |                 |                 |
   Extraction        Knowledge        Calculations
       |                 |                 |
       └─────────────────┼─────────────────┘
                         |
                 Agent Control Plane
                         |
                  Tool / MCP Gateway
                         |
             Existing Insurance Systems
                         |
              Human Approval / Authority
                         |
                       Audit
```

---

# 5. TECHNOLOGY STACK

## Frontend

Use:

- React 18+
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- TanStack Query
- React Router
- Zustand where appropriate
- Recharts

## Backend

Use:

- Python 3.12+
- FastAPI
- Pydantic v2
- SQLAlchemy 2
- PostgreSQL
- Alembic
- Redis

## AI

Use:

- LangGraph
- LLM provider abstraction
- Structured outputs
- RAG
- Tool calling
- MCP-compatible tool interfaces

Support:

- OpenAI
- Anthropic
- Mock LLM

Do not hard-code the application to one model provider.

---

# 6. ANTIGRAVITY DEVELOPMENT RULES

Before coding:

1. Inspect the existing repository.
2. Understand the existing project structure.
3. Do not delete existing functionality without justification.
4. Create an architecture plan.
5. Create a phased implementation plan.
6. Create database entities.
7. Create API contracts.
8. Create frontend route structure.
9. Create agent contracts.
10. Create workflow definitions.

Then implement incrementally.

After each phase:

- Run tests.
- Run lint.
- Run type checking.
- Run backend validation.
- Run frontend build.
- Fix errors.
- Continue only after the current phase is stable.

Never generate thousands of lines of code blindly.

---

# 7. REPOSITORY STRUCTURE

Create a clean monorepo.

```text
insureops-ai/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── api/
│   │   ├── stores/
│   │   ├── types/
│   │   └── utils/
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── repositories/
│   │   ├── services/
│   │   ├── rules/
│   │   ├── workflows/
│   │   └── infrastructure/
│   └── requirements.txt
│
├── agents/
│   ├── core/
│   ├── claims/
│   ├── underwriting/
│   ├── policy_service/
│   ├── tools/
│   ├── prompts/
│   └── evaluations/
│
├── infrastructure/
│
├── tests/
│
├── docs/
│
├── scripts/
│
├── docker-compose.yml
├── .env.example
├── Makefile
└── README.md
```

You may improve this structure if there is a better architecture.

---

# 8. MULTI-TENANT FOUNDATION

Design the application as SaaS-ready.

Core entities must support:

```text
tenant_id
created_at
updated_at
created_by
updated_by
```

Tenant isolation must be enforced server-side.

Never rely only on frontend filtering.

---

# 9. AUTHENTICATION

Implement:

- Login
- Logout
- JWT
- Password hashing
- Refresh token strategy
- Session handling
- Protected routes

Roles:

```text
SUPER_ADMIN
ORG_ADMIN
CLAIMS_MANAGER
CLAIMS_ADJUSTER
UNDERWRITER
FRAUD_ANALYST
CUSTOMER_SERVICE
COMPLIANCE_OFFICER
AUDITOR
EXECUTIVE
```

Permissions must be enforced on the backend.

---

# 10. CORE PLATFORM COMPONENTS

Build these shared services first.

## A. Workflow Engine

Responsible for:

- Workflow definition
- Workflow state
- Workflow execution
- Step transitions
- Retry
- Failure handling
- Human approval
- Escalation
- SLA tracking

## B. Agent Registry

Store:

```text
agent_id
name
description
version
owner
risk_level
model
allowed_tools
approval_requirement
status
```

## C. Tool Registry

Store:

```text
tool_id
name
description
permissions
input_schema
output_schema
risk_level
```

## D. Audit Service

Every important action must create an audit event.

## E. Evidence Service

Every AI recommendation must be traceable to evidence.

## F. Notification Service

Support:

- Email
- In-app notifications
- Webhooks

Use mock providers initially.

---

# 11. AGENT CONTROL PLANE

This is a major product capability.

Create an Agent Control Plane.

```text
Agent Registry
      |
      ↓
Risk Tier
      |
      ↓
Allowed Data
      |
      ↓
Allowed Tools
      |
      ↓
Approval Policy
      |
      ↓
Model
      |
      ↓
Prompt Version
      |
      ↓
Evaluation Score
      |
      ↓
Observability
```

Every agent must have:

```text
Agent ID
Agent Name
Version
Owner
Purpose
Risk Tier
Allowed Tools
Allowed Data
Model
Prompt Version
Approval Policy
Evaluation Score
Success Rate
Failure Rate
Latency
Cost
```

---

# 12. AUTONOMY MODEL

Implement three levels.

## Level 1: ASSIST

```text
AI prepares
Human decides
```

## Level 2: RECOMMEND

```text
AI analyzes
AI recommends
Human approves
```

## Level 3: EXECUTE

```text
AI analyzes
AI executes
```

Only low-risk and reversible operations can use Level 3.

High-impact actions must require human approval.

---

# 13. HUMAN-IN-THE-LOOP

Never allow the AI to independently:

- Reject a claim
- Deny coverage
- Confirm fraud
- Cancel a policy
- Make final underwriting rejection
- Make other high-impact decisions

Instead:

```text
AI Analysis
    ↓
Evidence
    ↓
Recommendation
    ↓
Confidence
    ↓
Human Review
    ↓
Approve / Reject / Modify / Escalate
    ↓
Audit
```

Create an Approval Inbox.

---

# 14. SHARED AI SERVICES

Build reusable AI capabilities.

## Document Intelligence

Support:

- PDF
- DOCX
- XLSX
- Images
- Scanned documents

Extract:

- Names
- Dates
- Policy numbers
- Claim numbers
- Amounts
- Addresses
- Organizations
- Vehicles
- Medical entities
- Business entities

Each extracted value must have:

```text
field
value
confidence
source_document
source_page
```

---

# 15. ENTITY RESOLUTION

Build an entity resolution service.

Resolve duplicates across:

- Customer
- Policy
- Claim
- Vehicle
- Property
- Workshop
- Hospital
- Broker

Use:

- Exact matching
- Normalized matching
- Fuzzy matching
- Embeddings where useful

Output:

```text
Entity Match
Confidence
Matching Signals
Recommended Action
```

Never automatically merge high-risk entities.

---

# 16. RAG PLATFORM

Create enterprise knowledge retrieval.

Sources:

- Policy wordings
- Claims manuals
- Underwriting guidelines
- SOPs
- Product documents
- Regulatory documents
- FAQs

Pipeline:

```text
Upload
 ↓
Parse
 ↓
Chunk
 ↓
Metadata
 ↓
Embed
 ↓
Vector Store
 ↓
Retrieve
 ↓
Rerank
 ↓
LLM
```

Every answer must provide:

```text
Document
Page
Policy Version
Relevant Evidence
```

If evidence is insufficient:

```text
Insufficient evidence to answer.
```

Never invent policy language.

---

# 17. RULE ENGINE

Create deterministic business rules.

Example:

```text
IF policy.status != ACTIVE
THEN coverage_status = INVALID

IF claim.amount > authority_limit
THEN human_review = TRUE

IF required_documents_missing
THEN status = PENDING_INFORMATION
```

Rules must be separate from LLM prompts.

Rules should be configurable.

Use deterministic code for:

- Arithmetic
- Date calculations
- Limits
- Deductibles
- Eligibility
- Authority limits
- Financial calculations

Do not use LLMs for these.

---

# 18. WORKFLOW 1
# COMMERCIAL SUBMISSION → UNDERWRITING DECISION PREPARATION

This is the first flagship workflow.

Input:

```text
Broker Email
PDF
Excel
Word
Loss Runs
Risk Reports
```

Workflow:

```text
Submission Received
        ↓
Submission Intake Agent
        ↓
Document Intelligence
        ↓
Entity Resolution
        ↓
Completeness Agent
        ↓
Missing Information
        ↓
Risk Extraction
        ↓
Historical Claims
        ↓
Underwriting Guidelines
        ↓
Risk Summary
        ↓
Underwriter Review
        ↓
Decision
```

---

# 19. SUBMISSION INTAKE AGENT

Responsibilities:

- Read broker email
- Identify applicant
- Identify line of business
- Identify requested coverage
- Identify submission type
- Extract documents
- Classify documents
- Create submission

Output:

```json
{
  "submission_id": "...",
  "applicant": "...",
  "line_of_business": "...",
  "coverage_requested": [],
  "documents": [],
  "confidence": 0.0
}
```

---

# 20. COMPLETENESS AGENT

Identify:

- Missing documents
- Missing fields
- Invalid documents
- Expired information
- Inconsistent information

Example:

```text
Submission Status: INCOMPLETE

Missing:
- 5-year loss history
- Updated property valuation
- Fire protection details
- Current occupancy information
```

Generate a broker request.

Track:

```text
REQUESTED
RECEIVED
VALIDATED
REJECTED
COMPLETED
```

---

# 21. RISK INTELLIGENCE

Create a risk summary from available information.

Show:

```text
Applicant
Industry
Locations
Revenue
Employees
Assets
Claims History
Loss History
Risk Factors
Coverage Requested
Risk Questions
```

Separate:

```text
FACTS
INFERENCES
RECOMMENDATIONS
```

Never present an inference as a fact.

---

# 22. UNDERWRITING DECISION PACKAGE

Create a professional decision package.

Sections:

```text
Executive Summary
Applicant
Coverage
Exposure
Loss History
Risk Factors
Missing Information
Policy/GUIDELINE Checks
AI Recommendations
Evidence
Questions for Underwriter
```

The underwriter should not need to manually read every document before beginning the review.

---

# 23. WORKFLOW 2
# CLAIM → ADJUSTER DECISION PACKAGE

This is the second flagship workflow.

Input:

- FNOL
- Claim form
- Policy
- Invoices
- Medical documents
- Repair documents
- Images
- Supporting documents

Workflow:

```text
Claim Received
       ↓
FNOL Agent
       ↓
Document Intelligence
       ↓
Policy Identification
       ↓
Coverage Validation
       ↓
Duplicate Detection
       ↓
Fraud Signals
       ↓
Severity Assessment
       ↓
Missing Information
       ↓
Claims Timeline
       ↓
Adjuster Decision Package
       ↓
Human Decision
```

---

# 24. CLAIMS INTAKE AGENT

Extract:

- Customer
- Policy
- Incident
- Claim type
- Incident date
- Location
- Amount
- Parties involved

Create claim.

---

# 25. CLAIMS VALIDATION AGENT

Check:

- Policy active
- Coverage
- Effective date
- Expiry
- Waiting period
- Deductible
- Exclusions
- Limits
- Required documents
- Previous claims

Return:

```text
Coverage Status
Validation Results
Exceptions
Evidence
Confidence
Recommendation
```

---

# 26. DUPLICATE CLAIM AGENT

Compare:

- Customer
- Policy
- Vehicle
- Property
- Incident date
- Location
- Workshop
- Hospital
- Invoice
- Amount
- Documents
- Images
- Previous claims

Return:

```text
Potential Duplicate
Probability
Related Claims
Matching Signals
Explanation
Recommended Action
```

Do not reject claims automatically.

---

# 27. FRAUD SIGNAL AGENT

Detect anomalies.

Examples:

- Duplicate documents
- Duplicate images
- Unusual claim frequency
- Timeline inconsistency
- Amount anomaly
- Customer history
- Workshop patterns
- Hospital patterns
- Document inconsistency

Return:

```text
Fraud Risk
Signals
Evidence
Related Cases
Recommended Investigation
```

Never say:

> "This customer committed fraud."

Instead:

> "Potential fraud indicators require investigation."

---

# 28. CLAIM DECISION PACKAGE

Generate:

```text
Claim Overview
Customer
Policy
Incident
Timeline
Documents
Coverage
Financials
Previous Claims
Duplicate Signals
Fraud Signals
Missing Information
AI Recommendation
Evidence
Human Decision
```

The goal is:

> Prepare the adjuster for the decision.

Not:

> Replace the adjuster.

---

# 29. WORKFLOW 3
# POLICY SERVICE REQUEST → RESOLUTION

Support:

- Address change
- Contact change
- Nominee change
- Policy document request
- Coverage question
- Dependent addition
- Dependent removal
- Endorsement request
- Renewal inquiry
- Payment issue

Workflow:

```text
Request
 ↓
Intent Detection
 ↓
Identity Verification
 ↓
Policy Lookup
 ↓
Eligibility
 ↓
Required Documents
 ↓
Validation
 ↓
Approval if required
 ↓
System Update
 ↓
Confirmation
 ↓
Audit
```

---

# 30. POLICY SERVICE AGENT

The agent must determine:

```text
Intent
Policy
Eligibility
Required Information
Required Documents
Risk Level
Approval Requirement
```

Do not allow an LLM to directly mutate core insurance data.

The agent must call an authorized backend tool.

---

# 31. TOOL / MCP LAYER

Create a tool abstraction.

Initial mock tools:

```text
get_policy()
get_customer()
get_claim()
get_previous_claims()
get_submission()
get_policy_documents()
create_claim()
update_claim()
create_service_request()
update_policy()
request_document()
send_notification()
create_approval()
record_audit_event()
search_knowledge()
```

Design them so real APIs can replace the mocks.

Architecture:

```text
Agent
 ↓
Tool Registry
 ↓
Permission Check
 ↓
Tool Adapter
 ↓
Mock Insurance System
```

Later:

```text
Tool Adapter
 ↓
Real Insurance API
```

---

# 32. MOCK INSURANCE SYSTEMS

Create realistic mock systems.

## Policy Administration System

Support:

- Policies
- Coverage
- Endorsements
- Customers

## Claims System

Support:

- Claims
- Claim events
- Documents
- Assessments

## CRM

Support:

- Customers
- Contacts
- Interactions

## Billing

Support:

- Premium
- Payment
- Outstanding balance

## Document Management

Support:

- Upload
- Search
- Metadata
- Version

These mock systems must behave like APIs, not hard-coded frontend data.

---

# 33. DATABASE

Use PostgreSQL.

Create models:

```text
Tenant
User
Role
Customer
Policy
PolicyCoverage
PolicyEndorsement
Claim
ClaimDocument
ClaimEvent
ClaimAssessment
FraudSignal
FraudInvestigation
UnderwritingSubmission
UnderwritingDocument
UnderwritingRisk
PolicyServiceRequest
ApprovalRequest
Agent
AgentRun
AgentDecision
AgentEvidence
Workflow
WorkflowExecution
WorkflowStep
KnowledgeDocument
KnowledgeChunk
Rule
AuditEvent
Notification
Tool
```

Use UUIDs.

Use Alembic migrations.

---

# 34. EXECUTIVE DASHBOARD

The dashboard must immediately answer:

### What needs human attention?

### What has AI completed?

### How much manual work has been eliminated?

Show:

```text
Cases Received
AI Processed
Human Review
Automation Rate
Average Processing Time
Manual Hours Saved
SLA Breaches
Potential Fraud Cases
Underwriting Submissions
Policy Service Requests
```

Charts:

- Workflow volume
- Processing time
- Automation rate
- Human workload
- Fraud signals
- SLA
- Agent success rate

---

# 35. OPERATIONS IMPACT

Create a major dashboard section:

```text
BEFORE AI

Average processing time
Manual steps
Systems touched
Human handoffs

AFTER AI

Average processing time
Manual steps
Systems touched
Human handoffs
```

Example:

```text
Before:
31 minutes
14 manual steps
5 systems
3 handoffs

After:
7 minutes
4 human actions
2 systems
1 approval
```

These must be clearly labeled as simulated/demo metrics unless derived from real measurements.

---

# 36. APPROVAL INBOX

Create:

```text
Case
Workflow
Risk
AI Recommendation
Confidence
SLA
Assigned To
Status
```

Actions:

```text
Approve
Reject
Modify
Request Information
Escalate
```

Every action creates an audit event.

---

# 37. CLAIM WORKSPACE

Build a high-quality enterprise workspace.

Layout:

```text
------------------------------------------------
Claim Header
------------------------------------------------

LEFT
Customer
Policy
Claim
Incident

CENTER
Timeline
Documents
AI Analysis
Evidence

RIGHT
Coverage
Fraud Signals
Risk
AI Recommendation
Approval
------------------------------------------------
```

Users must be able to inspect evidence.

---

# 38. UNDERWRITING WORKSPACE

Display:

```text
Submission
Applicant
Coverage
Exposure
Loss History
Documents
Missing Information
Risk Factors
Guideline Checks
AI Recommendation
Underwriter Decision
```

---

# 39. POLICY SERVICE WORKSPACE

Display:

```text
Customer
Policy
Request
Eligibility
Documents
Validation
Workflow
Approval
Status
Audit
```

---

# 40. AGENT MONITORING

Create an Agent Monitoring page.

Metrics:

```text
Agent
Runs
Success Rate
Failure Rate
Latency
Token Usage
Estimated Cost
Human Escalations
```

Individual run:

```text
Input
Tools Used
Output
Evidence
Validation
Human Approval
Final Result
```

Do NOT expose hidden chain-of-thought.

Show concise decision explanations and evidence.

---

# 41. AI EVALUATION

Create an evaluation framework.

Test:

- Hallucination
- Missing evidence
- Wrong policy
- Duplicate claim
- Ambiguous claim
- Prompt injection
- Incorrect extraction
- Low confidence
- Wrong tool use
- Wrong escalation
- Unsupported recommendation

Each evaluation should have:

```text
Test Case
Input
Expected Result
Actual Result
Pass/Fail
Score
```

---

# 42. SECURITY

Implement:

- JWT
- RBAC
- Tenant isolation
- Input validation
- Secure uploads
- File type validation
- File size limits
- Secrets through environment variables
- Audit logging
- PII masking
- Backend authorization

Never log sensitive PII unnecessarily.

---

# 43. AI SECURITY

Treat uploaded documents and retrieved content as untrusted input.

Protect against:

- Prompt injection
- Instruction hijacking
- Malicious documents
- Tool abuse
- Data exfiltration

Never allow document content to override system instructions.

Tool calls must pass authorization checks.

---

# 44. AI CONFIDENCE

Every AI result must provide:

```text
confidence
risk_level
evidence
recommendation
requires_human_review
```

Example:

```text
Confidence: 93%
Risk: LOW
Human Review: NO
```

or:

```text
Confidence: 68%
Risk: HIGH
Human Review: YES
```

Do not treat LLM confidence as mathematical probability.

Use it only as an internal decision-support signal.

---

# 45. AUDIT

Record:

```text
Who
What
When
Which workflow
Which agent
Which model
Which prompt version
Which tools
Which evidence
Which policy version
What recommendation
What human decision
```

Example:

```json
{
  "actor_type": "agent",
  "agent_id": "claims-validation-agent",
  "workflow_id": "...",
  "action": "coverage_validation",
  "entity_type": "claim",
  "entity_id": "...",
  "result": "REVIEW_REQUIRED",
  "model_version": "...",
  "prompt_version": "...",
  "policy_version": "...",
  "evidence": []
}
```

---

# 46. SEED DATA

Create realistic demo data.

Minimum:

```text
5 tenants
20 users
100 customers
150 policies
100 claims
50 claim documents
30 fraud signals
25 underwriting submissions
30 policy service requests
20 approval requests
```

Include deliberately interesting scenarios:

1. Clean claim
2. Duplicate claim
3. Suspicious claim
4. Missing documents
5. Expired policy
6. Coverage mismatch
7. High-value claim
8. Multiple previous claims
9. Incomplete underwriting submission
10. Clean underwriting submission
11. Policy service requiring approval
12. Low-risk service request that can be automatically completed

---

# 47. DEMO MODE

Create a Demo Mode.

Demo users should be able to run the workflows without external APIs.

Example:

```text
Demo Claim
↓
Run AI Analysis
↓
Watch workflow progress
↓
View extracted information
↓
View coverage validation
↓
View fraud signals
↓
View evidence
↓
View recommendation
↓
Approve
↓
Audit
```

The workflow should visibly show state transitions.

---

# 48. UX DESIGN

Use an enterprise insurance operations design.

Use:

- Tables
- Side panels
- Tabs
- Timelines
- Status badges
- Evidence panels
- Workflow progress
- Approval actions
- Charts

Avoid:

- Giant hero sections
- Marketing-style landing pages
- Excessive animations
- Generic chat UI
- Excessive cards
- Fake AI visual effects

The application should look like something an insurance operations team could actually use.

---

# 49. API DESIGN

Create REST APIs.

Examples:

```text
POST /api/v1/auth/login

GET /api/v1/dashboard

GET /api/v1/claims
POST /api/v1/claims
GET /api/v1/claims/{id}

POST /api/v1/claims/{id}/documents
POST /api/v1/claims/{id}/analyze
POST /api/v1/claims/{id}/validate
POST /api/v1/claims/{id}/fraud-analysis

GET /api/v1/underwriting/submissions
POST /api/v1/underwriting/submissions
POST /api/v1/underwriting/submissions/{id}/analyze

GET /api/v1/policies
GET /api/v1/policy-service
POST /api/v1/policy-service

GET /api/v1/approvals
POST /api/v1/approvals/{id}/decision

GET /api/v1/workflows
GET /api/v1/workflows/{id}

GET /api/v1/agents
GET /api/v1/agents/runs

GET /api/v1/audit

POST /api/v1/knowledge/documents
POST /api/v1/knowledge/search
```

Generate OpenAPI documentation.

---

# 50. TESTING

Create:

## Backend

- Unit tests
- API tests
- Service tests
- Rule tests
- Workflow tests

## Frontend

- Component tests
- API integration tests
- Critical workflow tests

## Agent tests

Test:

- Valid input
- Invalid input
- Missing evidence
- Ambiguous input
- Tool failure
- LLM failure
- Low confidence
- Human escalation

---

# 51. FAILURE HANDLING

Agents must fail safely.

Examples:

```text
LLM unavailable
→ Use fallback/mock provider

Document unreadable
→ Human review

Policy unavailable
→ Do not make coverage decision

Tool unavailable
→ Retry → escalate

Low confidence
→ Human review

Conflicting evidence
→ Human review
```

Never fabricate data to continue a workflow.

---

# 52. OBSERVABILITY

Track:

```text
Workflow ID
Agent ID
Run ID
Latency
Token usage
Tool calls
Errors
Retries
Human escalations
Final outcome
```

Create structured logging.

---

# 53. COST CONTROL

Do not call an LLM when a deterministic solution is sufficient.

Example:

```text
Policy active?
→ Database/rule

Deductible calculation?
→ Deterministic code

Document classification?
→ AI

Document extraction?
→ AI

Policy clause interpretation?
→ RAG + LLM

Financial calculation?
→ Deterministic code
```

Implement model selection abstraction so inexpensive models can handle simple tasks.

---

# 54. README

Create a detailed README covering:

- Product vision
- Business problem
- Architecture
- Workflows
- Agents
- Technology stack
- Repository structure
- Setup
- Environment variables
- Database
- Docker
- Seed data
- Demo accounts
- API documentation
- Testing
- AI configuration
- Mock mode
- Security
- Governance
- Roadmap

Use Mermaid diagrams.

---

# 55. ENVIRONMENT

Create:

```text
.env.example
```

Include:

```text
DATABASE_URL=
REDIS_URL=

JWT_SECRET=

OPENAI_API_KEY=
ANTHROPIC_API_KEY=

VECTOR_DB_URL=

STORAGE_PROVIDER=
STORAGE_BUCKET=

LLM_PROVIDER=mock
```

The application must work with:

```text
LLM_PROVIDER=mock
```

without external API keys.

---

# 56. DOCKER

Create:

```text
docker-compose.yml
```

Include:

```text
frontend
backend
postgres
redis
```

Optionally include vector database if required.

The goal is:

```bash
docker compose up
```

---

# 57. DEVELOPMENT PHASES

Do NOT implement everything at once.

## PHASE 1

Platform Foundation

Build:

- Repository structure
- Docker
- PostgreSQL
- Authentication
- RBAC
- Tenant
- Base UI
- Database
- API framework
- Audit framework
- Agent registry
- Tool registry
- Workflow engine foundation

STOP.

Run:

- Tests
- Lint
- Type check
- Build

Fix errors.

---

## PHASE 2

Commercial Underwriting Workflow

Build:

- Submission
- Document upload
- Document extraction
- Completeness
- Missing information
- Risk summary
- Underwriter workspace
- Approval

STOP.

Run all tests.

---

## PHASE 3

Claims Workflow

Build:

- FNOL
- Claims
- Documents
- Policy validation
- Duplicate detection
- Fraud signals
- Claims summary
- Adjuster workspace
- Approval

STOP.

Run all tests.

---

## PHASE 4

Policy Service Workflow

Build:

- Service request
- Intent
- Eligibility
- Documents
- Validation
- Execution
- Confirmation
- Audit

STOP.

Run all tests.

---

## PHASE 5

RAG + Knowledge

Build:

- Document ingestion
- Chunking
- Embeddings
- Search
- Reranking
- Evidence citations
- Knowledge workspace

---

## PHASE 6

Agent Control Plane

Build:

- Agent registry
- Risk levels
- Tool permissions
- Model configuration
- Prompt versions
- Agent evaluations
- Agent monitoring

---

## PHASE 7

Operations Intelligence

Build:

- Manual process analysis
- Workflow metrics
- Automation opportunity
- Time saved
- Manual steps removed
- SLA improvement

---

# 58. OPERATIONS INTELLIGENCE

This is a key differentiator.

Build a module that analyzes workflow activity and identifies repetitive work.

Example:

```text
Employee receives email
↓
Downloads attachment
↓
Reads PDF
↓
Copies policy number
↓
Opens policy system
↓
Searches policy
↓
Copies customer information
↓
Opens claims system
↓
Checks previous claims
↓
Updates spreadsheet
↓
Sends email
```

The system should identify:

```text
14 manual steps
5 systems
3 handoffs
31 minutes
7 duplicate data operations
```

Then propose:

```text
Automation opportunity:
HIGH

Estimated future time:
7 minutes

Estimated manual reduction:
77%

Human actions:
4
```

Clearly label such numbers as simulated when using demo data.

---

# 59. BUSINESS KPI FRAMEWORK

Track:

```text
Cases received
Cases processed
Automation rate
Human review rate
Average processing time
Manual hours saved
SLA breaches
Duplicate cases detected
Fraud signals
Documents processed
Underwriting submissions
Policy service requests
Human override rate
Agent failure rate
Agent latency
Estimated AI cost
```

---

# 60. IMPORTANT ARCHITECTURAL RULE

Use:

```text
RULES > ML > LLM
```

where deterministic logic is sufficient.

Use LLMs for:

- Unstructured document understanding
- Summarization
- Natural language
- Information extraction
- Reasoning over evidence
- Classification

Do NOT use LLMs for:

- Arithmetic
- Date calculations
- Financial calculations
- Deductibles
- Policy limits
- Deterministic eligibility
- Authority limits

---

# 61. PRODUCT DIFFERENTIATION

The platform should NOT compete as:

> "Another AI chatbot."

Position it as:

> **Insurance Workflow Automation & Decision Intelligence**

The platform should connect:

```text
Existing Insurance Systems
        +
Unstructured Work
        +
AI Agents
        +
Rules
        +
Human Expertise
        +
Audit
```

The product's measurable outcome is:

> **Manual work eliminated per insurance workflow.**

---

# 62. FINAL ACCEPTANCE CRITERIA

The MVP is complete only when I can:

1. Start the application.
2. Login.
3. See dashboard.
4. Create a commercial submission.
5. Upload documents.
6. Run AI analysis.
7. See extracted information.
8. See missing information.
9. See risk summary.
10. Send to underwriter.
11. Create a claim.
12. Upload claim documents.
13. Run claim analysis.
14. See coverage validation.
15. See duplicate/fraud signals.
16. See evidence.
17. Generate adjuster decision package.
18. Send to human approval.
19. Approve/reject/escalate.
20. Create policy service request.
21. Run service workflow.
22. See validation.
23. Execute authorized action.
24. View audit trail.
25. View agent runs.
26. View workflow metrics.
27. View automation impact.
28. Run the entire application in mock AI mode.
29. Run automated tests.
30. Start the system through Docker.

---

# 63. FINAL QUALITY BAR

Before declaring completion, perform:

```text
npm/pnpm build
npm/pnpm lint
npm/pnpm test

Python lint
Python type checking
Python tests

Database migration validation

Docker build

Docker startup

API health check

Frontend smoke test

Critical workflow smoke test
```

Fix all obvious errors.

Do not tell me that something is implemented if it is only a placeholder.

If a real external integration is unavailable, implement a clean mock adapter and clearly document where the real integration will be inserted.

---

# 64. FINAL RESPONSE FROM CLAUDE

At the end, report:

## Implemented

List actual functionality.

## Architecture

Explain the final architecture.

## Workflows

List the three implemented workflows.

## Agents

List actual implemented agents.

## APIs

List major API endpoints.

## Database

List major entities.

## Testing

Report actual test results.

## Run Instructions

Give exact commands.

## Demo Credentials

Provide seeded credentials.

## Known Limitations

Be explicit.

## Next Development Phase

Recommend the next highest-value implementation.

Do not claim production readiness unless it has actually been validated.

---

# MOST IMPORTANT INSTRUCTION

Build the system as an **insurance workflow operating layer**, not as a collection of AI demos.

The user should be able to look at the product and immediately understand:

> "This system takes repetitive insurance operational work, performs the machine work, prepares the evidence, routes exceptions to humans, and records everything for audit."

Start by inspecting the repository and creating the implementation plan.

Then begin PHASE 1.

Do not skip directly to a visual prototype.