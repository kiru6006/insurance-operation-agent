# INSUREOPS AI: PHASE-BY-CATEGORY BUILD SYSTEM

## OPERATING PRINCIPLES

- Generate complete, working code. No stubs or TODOs.
- Each category must compile and test before moving to next.
- Run validation at end of each category.
- Do NOT generate all code at once. Follow phases strictly.
- Test after each category. Fix before proceeding.
- Git commit after each category passes tests.

---

## PROJECT ARCHITECTURE & DIRECTORY STRUCTURE

```text
insurance-operation-agent/
├── .env.example                       # Reference environment variables
├── .gitignore                          # Git ignore rules for Python, Node, & DB
├── docker-compose.yml                  # PostgreSQL, Redis, Backend & Frontend containers
├── Dockerfile.backend                  # Python 3.12 FastAPI container definition
├── Dockerfile.frontend                 # Node 20 Vite React container definition
├── Makefile                            # Developer task shortcuts (up, down, test, migrate)
├── Plan.md                             # Architectural specification & product principles
├── README.md                           # Build system, phase guidelines & folder structure
│
├── backend/                            # FastAPI Application Root
│   ├── requirements.txt                # Python dependencies
│   ├── alembic.ini                     # Database migration configuration
│   ├── alembic/                        # Alembic database migrations
│   │   ├── env.py                      # DB URL & metadata config for Alembic
│   │   └── versions/                   # Versioned SQL migrations (001_initial_schema.py, etc.)
│   ├── app/
│   │   ├── __init__.py                 # Application package init
│   │   ├── main.py                     # FastAPI entrypoint, middleware, routers
│   │   ├── core/                       # Core configuration & utilities
│   │   │   ├── config.py               # Pydantic BaseSettings & environment config
│   │   │   ├── db.py                   # SQLAlchemy engine, SessionLocal & get_db
│   │   │   ├── security.py             # Password hashing (bcrypt) & JWT helpers
│   │   │   └── deps.py                 # FastAPI dependencies (auth, tenant, permissions)
│   │   ├── models/                     # SQLAlchemy ORM database models
│   │   │   ├── __init__.py             # Model exports
│   │   │   ├── models.py               # Platform models (Tenant, User, Audit, Workflow, Agent)
│   │   │   ├── submission.py           # Commercial submission & underwriting models
│   │   │   └── claims.py               # Claims & fraud assessment models
│   │   ├── repositories/               # Data access repository layer
│   │   │   ├── __init__.py
│   │   │   ├── base.py                 # Generic CRUD repository
│   │   │   ├── user.py                 # User and auth queries
│   │   │   ├── audit.py                # Audit log writer & query repository
│   │   │   ├── workflow.py             # Workflow state & run repository
│   │   │   └── agent.py                # Agent registration & execution history repository
│   │   ├── schemas/                    # Pydantic request/response validation schemas
│   │   │   ├── __init__.py
│   │   │   ├── auth.py                 # Login, tokens, and user profile schemas
│   │   │   ├── workflow.py             # Workflow create/update/status schemas
│   │   │   ├── agent.py                # Agent definition and run output schemas
│   │   │   ├── audit.py                # Audit event schemas
│   │   │   └── submission.py           # Insurance submission schemas
│   │   ├── services/                   # Business logic layer
│   │   │   ├── __init__.py
│   │   │   ├── auth.py                 # Authentication & authorization logic
│   │   │   ├── audit.py                # Audit trail logging
│   │   │   ├── workflow.py             # Workflow orchestration service
│   │   │   └── agent.py                # Agent execution & tool calling orchestration
│   │   ├── infrastructure/             # Mock external insurance systems & tools
│   │   │   ├── __init__.py
│   │   │   ├── mock_systems.py         # Mock Policy Admin, Claims, CRM, & Billing systems
│   │   │   ├── tools.py                # Tool registry & execution adapter
│   │   │   └── tool_implementations.py # Concrete tool functions (get_policy, create_claim, etc.)
│   │   └── api/                        # HTTP REST API routers
│   │       ├── __init__.py
│   │       └── routes/
│   │           ├── __init__.py
│   │           ├── health.py           # Healthcheck and status endpoints
│   │           ├── auth.py             # Authentication endpoints (login, logout, me)
│   │           ├── submissions.py      # Submission ingestion & triage endpoints
│   │           ├── approvals.py        # Human-in-the-loop approval endpoints
│   │           ├── tools.py            # Tool execution endpoints
│   │           └── dashboard.py        # Analytics & metrics endpoints
│   └── tests/                          # Automated backend tests
│       ├── __init__.py
│       ├── conftest.py                 # Pytest test client & test DB fixtures
│       ├── test_health.py              # Health check tests
│       ├── test_auth.py                # Authentication tests
│       └── test_models.py              # ORM model integrity tests
│
└── frontend/                           # React + Vite + TypeScript Frontend
    ├── package.json                    # Node dependencies & scripts
    ├── vite.config.ts                  # Vite configuration & backend proxy
    ├── tsconfig.json                   # TypeScript compiler options
    ├── tailwind.config.js              # Tailwind CSS configuration
    ├── postcss.config.js               # PostCSS plugins
    ├── index.html                      # Single page application HTML entry
    └── src/
        ├── main.tsx                    # React DOM render entry
        ├── App.tsx                     # Route definitions & router provider
        ├── index.css                   # Global styles & Tailwind directives
        ├── types/                      # TypeScript definitions (User, Workflow, Metrics)
        │   └── index.ts
        ├── stores/                     # Zustand state management
        │   └── authStore.ts            # Auth & session state
        ├── api/                        # API client & endpoint constants
        │   ├── client.ts               # Axios / Fetch client with auth interceptor
        │   └── endpoints.ts            # API URL mapping
        ├── layouts/                    # Application shells
        │   └── Layout.tsx              # Authenticated shell (Sidebar, Header, Outlet)
        ├── components/                 # Reusable UI components
        │   └── ProtectedRoute.tsx      # Route authentication guard
        └── pages/                      # Page views
            ├── LoginPage.tsx           # Authentication view
            ├── DashboardPage.tsx       # Operations & metrics dashboard
            ├── SubmissionsPage.tsx     # Submission queue & details
            └── ApprovalsPage.tsx       # Human-in-the-loop approval inbox
```

---

## PHASE 1: PLATFORM FOUNDATION

### PHASE 1.A: PROJECT INITIALIZATION
**Category: Infrastructure, Docker, Git**

Generate:
1. Directory structure (create all directories)
2. .gitignore (Python + Node + environment files)
3. docker-compose.yml (postgres, redis, backend, frontend)
4. Dockerfile.backend (Python 3.12 FastAPI)
5. Dockerfile.frontend (Node 20 Vite)
6. Makefile (all dev commands)
7. .env.example (all environment variables)
8. README.md (scaffold)

Validation:
- [ ] Directory structure exists
- [ ] docker-compose.yml syntax valid (check with: docker-compose config)
- [ ] All 7 files created

---

### PHASE 1.B: BACKEND BOOTSTRAP
**Category: FastAPI, Pydantic, Configuration**

Generate:
1. backend/requirements.txt (all dependencies)
2. backend/app/__init__.py (empty)
3. backend/app/main.py (FastAPI app with CORS, health endpoint)
4. backend/app/core/config.py (Settings class, environment variables)
5. backend/app/core/db.py (SQLAlchemy engine, SessionLocal, get_db)
6. backend/app/core/security.py (JWT, password hashing functions)

Validation:
```bash
cd backend
pip install -r requirements.txt
python -m pytest --version
python -c "from app.main import app; print('✓ App imports successfully')"
python -c "from app.core.config import settings; print(f'✓ Settings loaded: {settings.ENVIRONMENT}')"
```

Git commit: `backend: FastAPI bootstrap with config and security`

---

### PHASE 1.C: DATABASE MODELS
**Category: SQLAlchemy ORM, Alembic Migrations**

Generate:
1. backend/app/models/__init__.py (import all models)
2. backend/app/models/models.py (all 8 entities: Tenant, User, AuditEvent, Workflow, Agent, AgentRun, ApprovalRequest, Tool)
3. backend/alembic.ini (Alembic config)
4. backend/alembic/env.py (database URL configuration)
5. backend/alembic/versions/001_initial_schema.py (migration with all tables)

Validation:
```bash
cd backend
alembic upgrade head
python -c "from app.models import *; print('✓ All models import')"
```

Git commit: `database: SQLAlchemy models + Alembic migrations`

---

### PHASE 1.D: REPOSITORIES & DATA ACCESS
**Category: Repository Pattern**

Generate:
1. backend/app/repositories/__init__.py
2. backend/app/repositories/base.py (BaseRepository with CRUD)
3. backend/app/repositories/user.py (UserRepository with create_user, get_by_username)
4. backend/app/repositories/audit.py (AuditRepository with log_event)
5. backend/app/repositories/workflow.py (WorkflowRepository)
6. backend/app/repositories/agent.py (AgentRepository)

Validation:
```bash
python -c "from app.repositories.user import UserRepository; print('✓ Repositories import')"
```

Git commit: `repositories: data access layer with base + specialized repos`

---

### PHASE 1.E: SCHEMAS (REQUEST/RESPONSE)
**Category: Pydantic Validation**

Generate:
1. backend/app/schemas/__init__.py
2. backend/app/schemas/auth.py (LoginRequest, TokenResponse, UserResponse)
3. backend/app/schemas/workflow.py (WorkflowResponse, WorkflowCreate)
4. backend/app/schemas/agent.py (AgentResponse, AgentRunResponse)
5. backend/app/schemas/audit.py (AuditEventResponse)

Validation:
```bash
python -c "from app.schemas import *; print('✓ All schemas import')"
```

Git commit: `schemas: Pydantic request/response models`

---

### PHASE 1.F: SERVICES (BUSINESS LOGIC)
**Category: Service Layer**

Generate:
1. backend/app/services/__init__.py
2. backend/app/services/auth.py (AuthService with login method)
3. backend/app/services/audit.py (AuditService with log_event)
4. backend/app/services/workflow.py (WorkflowService with create, get, list)
5. backend/app/services/agent.py (AgentService with register, execute_agent)

Validation:
```bash
python -c "from app.services.auth import AuthService; print('✓ Services import')"
```

Git commit: `services: business logic layer`

---

### PHASE 1.G: DEPENDENCIES & MIDDLEWARE
**Category: FastAPI Utilities**

Generate:
1. backend/app/core/deps.py (get_current_user, get_current_tenant dependencies)
2. backend/app/api/__init__.py
3. backend/app/api/routes/__init__.py
4. backend/app/api/routes/health.py (GET /health)

Validation:
```bash
python -c "from app.core.deps import *; print('✓ Dependencies import')"
```

Git commit: `api: dependencies and middleware`

---

### PHASE 1.H: API ROUTES (PART 1)
**Category: REST Endpoints - Auth & Health**

Generate:
1. backend/app/api/routes/auth.py (POST /login, POST /logout)
2. Update backend/app/main.py to include routers: health, auth
3. Add root GET / endpoint (redirect to docs or status)

Validation:
```bash
# Start backend
uvicorn app.main:app --reload

# In another terminal:
curl http://localhost:8000/health
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "demo", "password": "demo"}'
# Should return access_token (use mock data for now)
```

Git commit: `api: auth and health endpoints`

---

### PHASE 1.I: TESTS (BACKEND)
**Category: pytest, Testing Framework**

Generate:
1. backend/tests/__init__.py
2. backend/tests/conftest.py (pytest fixtures: db, client)
3. backend/tests/test_health.py (test health endpoint)
4. backend/tests/test_auth.py (test login endpoint)
5. backend/tests/test_models.py (test model creation)

Validation:
```bash
cd backend
pytest tests/ -v --tb=short
# All tests MUST pass
```

Git commit: `tests: backend unit and integration tests`

---

### PHASE 1.J: FRONTEND BOOTSTRAP
**Category: React, Vite, TypeScript**

Generate:
1. frontend/package.json (all dependencies)
2. frontend/vite.config.ts (Vite config with API proxy)
3. frontend/tsconfig.json (TypeScript strict mode)
4. frontend/tailwind.config.js (Tailwind)
5. frontend/postcss.config.js (PostCSS)
6. frontend/index.html (HTML entry point)
7. frontend/src/main.tsx (React entry)
8. frontend/src/index.css (Tailwind imports)

Validation:
```bash
cd frontend
npm install
npm run build
# No errors in build
```

Git commit: `frontend: React + Vite + TypeScript bootstrap`

---

### PHASE 1.K: FRONTEND TYPES & STORES
**Category: TypeScript Interfaces, Zustand State Management**

Generate:
1. frontend/src/types/index.ts (User, AuthStore, ApiResponse types)
2. frontend/src/stores/authStore.ts (Zustand auth store with login, logout, token management)
3. frontend/src/api/client.ts (Axios instance with token injection)
4. frontend/src/api/endpoints.ts (API URL constants)

Validation:
```bash
npm run build
# No TypeScript errors
```

Git commit: `frontend: types and state management`

---

### PHASE 1.L: FRONTEND COMPONENTS & PAGES
**Category: React Components, React Router**

Generate:
1. frontend/src/layouts/Layout.tsx (authenticated layout with sidebar, header, outlet)
2. frontend/src/pages/LoginPage.tsx (login form, credential input, error handling)
3. frontend/src/pages/DashboardPage.tsx (stub dashboard with 4 metric cards)
4. frontend/src/components/ProtectedRoute.tsx (route guard)
5. frontend/src/App.tsx (router setup with protected routes)

Validation:
```bash
npm run dev
# Visit http://localhost:5173
# Login page appears
# Can login with demo/demo (calls backend)
# Redirects to dashboard
# Logout button works
```

Git commit: `frontend: layout, pages, routing`

---

### PHASE 1.M: MOCK INSURANCE SYSTEMS
**Category: In-Memory Mock Backends**

Generate:
1. backend/app/infrastructure/__init__.py
2. backend/app/infrastructure/mock_systems.py (MockPolicySystem, MockClaimsSystem, MockCustomerCRM, MockBillingSystem)
3. Each system has: get(), create(), update(), list() methods
4. Seed data: 5 policies, 10 claims, 20 customers

Validation:
```bash
python -c "
from app.infrastructure.mock_systems import MockPolicySystem
ps = MockPolicySystem()
policy = ps.get_policy('POL-001')
print(f'✓ Mock system returns: {policy}')
"
```

Git commit: `infrastructure: mock insurance systems with seed data`

---

### PHASE 1.N: TOOL REGISTRY & ABSTRACTION
**Category: Tool Execution Layer**

Generate:
1. backend/app/infrastructure/tools.py (Tool interface, ToolAdapter, execute_tool)
2. backend/app/infrastructure/tool_implementations.py (get_policy, get_claim, create_claim, etc.)
3. backend/app/api/routes/tools.py (POST /tools/{id}/execute endpoint)

Validation:
```bash
curl -X POST http://localhost:8000/api/v1/tools/get_policy/execute \
  -H "Content-Type: application/json" \
  -d '{"policy_id": "POL-001"}'
# Returns policy data
```

Git commit: `tools: tool registry and execution abstraction`

---

### PHASE 1.O: DOCKER BUILD & RUN
**Category: Docker Composition**

Commands:
```bash
cd insureops-ai
cp .env.example .env
docker compose build
docker compose up -d

# Wait 10 seconds for healthchecks
sleep 10

# Validation:
curl http://localhost:8000/health
curl http://localhost:5173
```

All 4 services should be healthy.

Git commit: `docker: all services running in composition`

---

### PHASE 1 COMPLETION CHECKLIST

Before moving to Phase 2:
- [ ] `docker compose up` works
- [ ] Backend health check responds
- [ ] Frontend loads at :5173
- [ ] Login with demo/demo works
- [ ] Dashboard visible after login
- [ ] All backend tests pass
- [ ] No TypeScript errors in frontend
- [ ] All git commits complete
- [ ] No uncommitted changes

```bash
# Final validation:
docker compose logs backend
docker compose logs frontend
# Both should show "ready" or equivalent
```

---

## PHASE 2: COMMERCIAL UNDERWRITING WORKFLOW

### PHASE 2.A: DATABASE MODELS (SUBMISSION ENTITIES)
**Category: SQLAlchemy Models**

Generate:
1. backend/app/models/models.py (add to existing):
   - UnderwritingSubmission
   - SubmissionDocument
   - SubmissionRisk
   - SubmissionLineOfBusiness
2. backend/alembic/versions/002_add_submission_entities.py (migration)

Validation:
```bash
alembic upgrade head
python -c "from app.models import UnderwritingSubmission; print('✓ Models')"
```

Git commit: `models: underwriting submission entities`

---

### PHASE 2.B: REPOSITORIES (SUBMISSION)
**Category: Data Access**

Generate:
1. backend/app/repositories/submission.py (SubmissionRepository)
2. backend/app/repositories/submission_document.py (SubmissionDocumentRepository)

Git commit: `repositories: submission data access`

---

### PHASE 2.C: SCHEMAS (SUBMISSION)
**Category: Pydantic Models**

Generate:
1. backend/app/schemas/submission.py (SubmissionCreate, SubmissionResponse, DocumentResponse)

Git commit: `schemas: submission schemas`

---

### PHASE 2.D: MOCK SUBMISSION DATA
**Category: Seed Data**

Update backend/app/infrastructure/mock_systems.py:
- Add 30 sample UnderwritingSubmission objects
- Add sample broker emails (text format)
- Add sample document files (mock file references)

Git commit: `seed: 30 sample submissions with documents`

---

### PHASE 2.E: AGENTS - SUBMISSION INTAKE AGENT
**Category: LangGraph Agent**

Generate:
1. backend/agents/__init__.py
2. backend/agents/core/__init__.py
3. backend/agents/core/llm_provider.py (LLMProvider abstraction, MockProvider, AnthropicProvider)
4. backend/agents/submission/__init__.py
5. backend/agents/submission/intake.py (SubmissionIntakeAgent using LangGraph)
   - Input: email text + documents
   - Output: structured submission data (applicant, LOB, coverage)
   - Use Claude 3.5 Sonnet or mock

Validation:
```bash
python -c "
from agents.submission.intake import submission_intake_agent
result = submission_intake_agent({'email': 'test', 'documents': []})
print(f'✓ Agent returns: {result}')
"
```

Git commit: `agents: submission intake agent`

---

### PHASE 2.F: AGENTS - COMPLETENESS AGENT
**Category: LangGraph Agent**

Generate:
1. backend/agents/submission/completeness.py (CompletenessAgent)
   - Input: submission
   - Output: missing documents list
   - Use rules + LLM

Git commit: `agents: completeness validation agent`

---

### PHASE 2.G: AGENTS - RISK SUMMARY AGENT
**Category: LangGraph Agent**

Generate:
1. backend/agents/submission/risk_summary.py (RiskSummaryAgent)
   - Input: submission + documents
   - Output: risk factors, applicant info, exposure
   - Use document intelligence + LLM

Git commit: `agents: risk summary extraction agent`

---

### PHASE 2.H: WORKFLOW ORCHESTRATION
**Category: Workflow Engine**

Generate:
1. backend/app/services/workflow.py (update with submission workflow execution)
2. backend/agents/submission/workflow.py (submission_workflow function that chains agents)
   - submission_intake → completeness → risk_summary
   - Store intermediate results

Git commit: `workflow: submission workflow orchestration`

---

### PHASE 2.I: API - SUBMISSION ENDPOINTS
**Category: REST Routes**

Generate:
1. backend/app/api/routes/submissions.py:
   - POST /submissions (create submission)
   - GET /submissions/{id} (get submission)
   - GET /submissions (list submissions)
   - POST /submissions/{id}/analyze (run workflow)
   - GET /submissions/{id}/workflow-status (get workflow status)

Validation:
```bash
curl -X POST http://localhost:8000/api/v1/submissions \
  -H "Content-Type: application/json" \
  -d '{...}'
```

Git commit: `api: submission endpoints`

---

### PHASE 2.J: TESTS - SUBMISSION WORKFLOW
**Category: Integration Tests**

Generate:
1. backend/tests/test_submission_workflow.py:
   - test_create_submission
   - test_submission_intake_agent
   - test_completeness_agent
   - test_risk_summary_agent
   - test_full_workflow
   - test_workflow_status_tracking

Validation:
```bash
pytest tests/test_submission_workflow.py -v
# All tests pass
```

Git commit: `tests: submission workflow integration tests`

---

### PHASE 2.K: FRONTEND - SUBMISSION PAGES
**Category: React Components**

Generate:
1. frontend/src/pages/SubmissionsListPage.tsx (table of submissions)
2. frontend/src/pages/SubmissionDetailPage.tsx (view submission, documents, status)
3. frontend/src/pages/CreateSubmissionPage.tsx (form: broker email, document upload)
4. frontend/src/components/DocumentUpload.tsx (file upload component)
5. frontend/src/components/SubmissionTimeline.tsx (workflow progress display)

Validation:
```bash
npm run dev
# Navigate to submissions
# Can create submission
# Can upload documents
# See workflow progress
```

Git commit: `frontend: submission pages and components`

---

### PHASE 2.L: FRONTEND - API INTEGRATION
**Category: API Service Layer**

Generate:
1. frontend/src/services/submissionService.ts:
   - createSubmission()
   - getSubmission()
   - listSubmissions()
   - uploadDocument()
   - analyzeSubmission()
   - getWorkflowStatus()

2. Update pages to use services via TanStack Query

Git commit: `frontend: submission API service integration`

---

### PHASE 2.M: APPROVAL WORKFLOW
**Category: Approval System**

Generate:
1. backend/app/api/routes/approvals.py:
   - GET /approvals (list pending approvals)
   - POST /approvals/{id}/approve
   - POST /approvals/{id}/reject
   - POST /approvals/{id}/request-info

2. frontend/src/pages/ApprovalsPage.tsx (approval inbox with actions)

Git commit: `approval: approval inbox and workflow`

---

### PHASE 2.N: DASHBOARD UPDATE
**Category: Metrics & Analytics**

Update frontend/src/pages/DashboardPage.tsx to show:
- Submissions received (real count from DB)
- AI processed (count with status = completed)
- Pending review (count with status = pending_approval)
- Automation rate (processed / received %)

Connect to actual backend metrics endpoint.

Git commit: `dashboard: real metrics for submission workflow`

---

### PHASE 2 COMPLETION

Validation:
```bash
# Full workflow test:
1. Login to frontend
2. Create submission
3. Upload documents
4. Click "Analyze"
5. Watch workflow execute in real-time
6. See extracted data
7. See completeness check results
8. See risk summary
9. See approval request in inbox
10. Approve/reject
11. See audit trail
12. Check dashboard metrics updated
```

All tests pass:
```bash
pytest tests/ -v
npm run build
docker compose up
```

---

## PHASE 3: CLAIMS WORKFLOW

Repeat Phase 2 pattern:
- 3.A: Database models (Claim, ClaimDocument, ClaimAssessment)
- 3.B-C: Repositories + Schemas
- 3.D: Mock data
- 3.E-G: Agents (intake, validation, fraud signals)
- 3.H: Workflow orchestration
- 3.I: API endpoints
- 3.J: Tests
- 3.K-L: Frontend pages
- 3.M: Approval
- 3.N: Dashboard update

---

## PHASE 4: POLICY SERVICE

Repeat Phase 2 pattern (simplified):
- 4.A: Database models (PolicyServiceRequest)
- 4.B-C: Repositories + Schemas
- 4.D: Mock data
- 4.E-F: Agents (intent detection, eligibility)
- 4.G: Workflow
- 4.H: API
- 4.I: Tests
- 4.J-K: Frontend

---

## PHASE 5+: ADVANCED (RAG, CONTROL PLANE, ANALYTICS)

Defer until Phase 1-4 complete and stable.

---

## COMMIT TEMPLATE

Each category generates one commit:


---

## FINAL ACCEPTANCE CRITERIA

At end of Phase 2 (first complete workflow):
- [ ] `docker compose up` runs all services
- [ ] Frontend login works
- [ ] Can create submission
- [ ] Can upload documents
- [ ] Agents execute and return structured data
- [ ] Approval inbox functional
- [ ] Dashboard shows real metrics
- [ ] All tests pass
- [ ] No uncommitted changes
- [ ] README updated with demo steps

---

## RUNNING THIS PROMPT

1. Paste this entire prompt into Antigravity IDE
2. Tell Claude: "Execute PHASE 1, category by category. Wait for my confirmation before moving to next category."
3. After each category:
   - Verify validation commands pass
   - Git commit with message
   - Ask: "Ready for next category?"
4. Only move to Phase 2 after Phase 1 complete

---

END PROMPT