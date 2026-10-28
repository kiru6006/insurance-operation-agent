// In-memory mock backend state and handler for GitHub Pages static deployment
// or standalone client-side evaluation without a running Python backend server.

export interface MockState {
  submissions: any[]
  claims: any[]
  policyServices: any[]
  approvals: any[]
  knowledgeDocs: any[]
  agentRuns: any[]
}

const STORAGE_KEY = 'INSUREOPS_MOCK_STATE_V1'

function getInitialState(): MockState {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {
      console.warn('Failed to parse local mock state, initializing fresh.', e)
    }
  }

  // Pre-seed realistic data matching backend mock systems
  const initialSubmissions = [
    {
      id: 'SUB-001',
      broker_id: 'BRK-001',
      applicant_name: 'Apex Logistics Corp',
      line_of_business: 'COMMERCIAL_PROPERTY',
      status: 'submitted',
      created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      initial_email_text: 'Quote request for 45,000 sq ft regional distribution warehouse facility and logistics depot.',
      documents: [
        { id: 'DOC-101', file_name: 'ACORD_125_Commercial_Application.pdf', document_type: 'acord_125' },
        { id: 'DOC-102', file_name: 'ACORD_140_Property_Schedule.pdf', document_type: 'acord_140' },
        { id: 'DOC-103', file_name: 'Three_Year_Loss_Runs.pdf', document_type: 'loss_runs' }
      ]
    },
    {
      id: 'SUB-002',
      broker_id: 'BRK-002',
      applicant_name: 'Beacon Hospitality Group',
      line_of_business: 'GENERAL_LIABILITY',
      status: 'analyzed',
      created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
      initial_email_text: 'Boutique hotel with rooftop bar and restaurant seeking comprehensive CGL quote.',
      documents: [
        { id: 'DOC-104', file_name: 'ACORD_126_CGL_Application.pdf', document_type: 'acord_126' },
        { id: 'DOC-105', file_name: 'Liquor_Liability_Supplemental.pdf', document_type: 'supplemental' }
      ]
    },
    {
      id: 'SUB-003',
      broker_id: 'BRK-003',
      applicant_name: 'Summit Precision Machining',
      line_of_business: 'WORKERS_COMP',
      status: 'submitted',
      created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      initial_email_text: 'Precision CNC metal machining facility with 48 active employees.',
      documents: [
        { id: 'DOC-106', file_name: 'ACORD_130_Workers_Comp.pdf', document_type: 'acord_130' }
      ]
    }
  ]

  const initialClaims = [
    {
      id: 'CLM-001',
      policy_id: 'POL-001',
      customer_id: 'CUST-001',
      claimant_name: 'Apex Logistics Corp',
      incident_date: '2026-10-15T08:30:00',
      amount_claimed: 4500.0,
      claim_type: 'auto_collision',
      description: 'Delivery truck struck loading dock beam during reverse maneuver causing fender and hydraulic tail lift damage.',
      incident_location: 'Warehouse Bay 4, Chicago, IL',
      status: 'reported',
      created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
      fnol_email: 'From: claims@apexlogistics.com\nSubject: FNOL - Delivery truck backing collision at loading bay.',
      documents: [
        { id: 'CDOC-1', file_name: 'FNOL_Incident_Report.pdf', document_type: 'incident_report', file_path: '#' },
        { id: 'CDOC-2', file_name: 'Damage_Photographs.zip', document_type: 'photographs', file_path: '#' },
        { id: 'CDOC-3', file_name: 'Repair_Estimate_Invoice.pdf', document_type: 'invoice', file_path: '#' }
      ]
    },
    {
      id: 'CLM-002',
      policy_id: 'POL-001',
      customer_id: 'CUST-002',
      claimant_name: 'Nexus Healthcare Clinic',
      incident_date: '2026-10-12T14:15:00',
      amount_claimed: 18250.0,
      claim_type: 'commercial_property_water',
      description: 'Broken pipe in dental clinic ceiling flooded consultation rooms 3 and 4 over weekend.',
      incident_location: '400 Health Ave, Dallas, TX',
      status: 'under_review',
      created_at: new Date(Date.now() - 3600000 * 20).toISOString(),
      fnol_email: 'From: clinic-manager@nexushealth.com\nSubject: FNOL Water Damage - Broken pipe ceiling burst.',
      documents: [
        { id: 'CDOC-4', file_name: 'Emergency_Plumbing_Report.pdf', document_type: 'incident_report', file_path: '#' }
      ]
    },
    {
      id: 'CLM-007',
      policy_id: 'POL-001',
      customer_id: 'CUST-003',
      claimant_name: 'Highland Freight Services',
      incident_date: '2026-10-20T22:00:00',
      amount_claimed: 34800.0,
      claim_type: 'auto_collision',
      description: 'Highway collision with concrete divider [ANOMALY DETECTED: Similar invoice submitted under different policy or repair estimate exceeds market standard by 300%].',
      incident_location: 'Interstate 80 Mile 142, IL',
      status: 'under_review',
      is_suspicious: true,
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      fnol_email: 'From: claims@highlandfreight.com\nSubject: FNOL - Highway accident claim.',
      documents: [
        { id: 'CDOC-5', file_name: 'Police_Accident_Report.pdf', document_type: 'police_report', file_path: '#' }
      ]
    }
  ]

  const initialPolicyServices = [
    {
      id: 'PSR-001',
      policy_id: 'POL-001',
      customer_id: 'CUST-001',
      request_type: 'address_change',
      description: 'Commercial premises relocation to 850 Logistics Blvd, Joliet, IL',
      requested_changes: { new_address: '850 Logistics Blvd, Joliet, IL' },
      status: 'resolved',
      created_at: new Date(Date.now() - 3600000 * 30).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 29).toISOString()
    },
    {
      id: 'PSR-002',
      policy_id: 'POL-001',
      customer_id: 'CUST-001',
      request_type: 'vehicle_addition',
      description: 'Add newly acquired 2026 Peterbilt 579 Sleeper to commercial fleet schedule',
      requested_changes: { vehicle: '2026 Peterbilt 579 Sleeper', vin: '1XP7D49X7ND829101' },
      status: 'pending',
      created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 5).toISOString()
    },
    {
      id: 'PSR-003',
      policy_id: 'POL-001',
      customer_id: 'CUST-002',
      request_type: 'certificate_request',
      description: 'Issue Certificate of Insurance (COI) for general contractor project bid',
      requested_changes: { holder: 'Midwest Builders Consortium', coverage_required: '$2,000,000 Aggregate' },
      status: 'pending',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 2).toISOString()
    }
  ]

  const initialApprovals = [
    {
      id: 'APP-001',
      submission_id: 'SUB-001',
      approval_type: 'underwriting_review',
      severity: 'medium',
      reason: 'Underwriting appetite check: Warehouse square footage exceeds standard automated threshold.',
      status: 'pending',
      created_at: new Date(Date.now() - 3600000 * 3).toISOString()
    },
    {
      id: 'APP-002',
      submission_id: 'SUB-002',
      approval_type: 'underwriting_review',
      severity: 'high',
      reason: 'Rooftop venue liquor liability exposure requires underwriter risk signoff.',
      status: 'pending',
      created_at: new Date(Date.now() - 3600000 * 7).toISOString()
    },
    {
      id: 'APP-003',
      submission_id: 'CLM-007',
      approval_type: 'claims_escalation',
      severity: 'high',
      reason: 'Fraud anomaly flag: Repair estimate exceeds benchmark by 300%. Senior adjuster review required.',
      status: 'pending',
      created_at: new Date(Date.now() - 3600000 * 1).toISOString()
    }
  ]

  const initialKnowledge = [
    {
      id: 'KDOC-001',
      title: 'Commercial Property Underwriting Guidelines 2026',
      doc_type: 'underwriting_guide',
      version: '3.2',
      created_at: '2026-01-10T00:00:00Z',
      content: 'Commercial property guidelines dictate mandatory sprinkler certification for buildings exceeding 30,000 square feet. Wood frame construction carries a surcharge rate of 1.45x. Maximum single-risk binding capacity without reinsurance treaty referral is $5,000,000.'
    },
    {
      id: 'KDOC-002',
      title: 'First Notice of Loss Fast-Track Adjudication Rules',
      doc_type: 'claims_manual',
      version: '2.1',
      created_at: '2026-02-15T00:00:00Z',
      content: 'Auto collision and minor commercial property losses under $10,000 claimed amount are eligible for Level 3 Straight-Through automated payment approval provided no fraud anomalies, zero prior suspicious claims within 24 months, and current active policy status.'
    },
    {
      id: 'KDOC-003',
      title: 'Policy Servicing & Endorsement Governance Matrix',
      doc_type: 'servicing_standard',
      version: '1.4',
      created_at: '2026-03-01T00:00:00Z',
      content: 'Address changes, contact details, and certificate of insurance (COI) requests operate at Level 3 Autonomy (Execute). Fleet vehicle additions operate at Level 2 Autonomy (Recommend with underwriter approval). Coverage limit increases and policy cancelation operate at Level 1 Autonomy (Assist only).'
    }
  ]

  const initialAgentRuns = [
    {
      id: 'RUN-901',
      agent_name: 'Commercial Underwriting Completeness Agent',
      action: 'audit_acord_submission',
      status: 'completed',
      latency_ms: 382,
      tokens_used: 1240,
      evidence_count: 5,
      created_at: new Date(Date.now() - 60000 * 12).toISOString()
    },
    {
      id: 'RUN-902',
      agent_name: 'Claims Fraud & Duplicate Detection Agent',
      action: 'evaluate_fraud_anomaly_vector',
      status: 'completed',
      latency_ms: 412,
      tokens_used: 1480,
      evidence_count: 3,
      created_at: new Date(Date.now() - 60000 * 8).toISOString()
    },
    {
      id: 'RUN-903',
      agent_name: 'Policy Servicing Governance & Execution Agent',
      action: 'verify_endorsement_eligibility',
      status: 'completed',
      latency_ms: 220,
      tokens_used: 890,
      evidence_count: 2,
      created_at: new Date(Date.now() - 60000 * 2).toISOString()
    }
  ]

  return {
    submissions: initialSubmissions,
    claims: initialClaims,
    policyServices: initialPolicyServices,
    approvals: initialApprovals,
    knowledgeDocs: initialKnowledge,
    agentRuns: initialAgentRuns
  }
}

let state: MockState = getInitialState()

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.warn('Unable to persist mock state to localStorage', e)
  }
}

export function handleMockRequest(method: string, path: string, data?: any): { status: number; data: any } | null {
  const normPath = path.replace(/^\/api\/v1/, '').replace(/^\/api/, '')
  const m = method.toUpperCase()

  // 1. Auth routes
  if (normPath === '/auth/login' && m === 'POST') {
    return {
      status: 200,
      data: {
        access_token: 'mock-jwt-token-' + Date.now(),
        token_type: 'bearer',
        expires_in: 86400
      }
    }
  }

  // 2. Dashboard metrics
  if (normPath === '/dashboard/metrics' && m === 'GET') {
    const totalSubs = state.submissions.length
    const analyzedSubs = state.submissions.filter((s) => s.status === 'analyzed').length
    const pendingSubs = state.submissions.filter((s) => s.status === 'submitted').length
    const autoRate = totalSubs > 0 ? Math.round((analyzedSubs / totalSubs) * 1000) / 10 : 0

    return {
      status: 200,
      data: {
        casesReceived: totalSubs,
        aiProcessed: analyzedSubs,
        pendingReview: pendingSubs,
        automationRate: autoRate,
        totalClaims: state.claims.length,
        claimsAutoAdjudicated: state.claims.filter((c) => c.status === 'approved').length,
        claimsUnderReview: state.claims.filter((c) => c.status !== 'approved').length,
        totalServiceRequests: state.policyServices.length,
        servicingStraightThrough: state.policyServices.filter((p) => p.status === 'resolved').length,
        operationsImpact: {
          commercial_underwriting: {
            workflow: 'Commercial Underwriting Submission',
            before: { avg_processing_time: '31 mins', manual_steps: 14, systems_touched: 5, human_handoffs: 3 },
            after: { avg_processing_time: '7 mins', manual_steps: 4, systems_touched: 2, human_handoffs: 1 },
            time_reduction_pct: 77.4,
            manual_steps_saved: 10
          },
          claims_adjudication: {
            workflow: 'First Notice of Loss Adjudication',
            before: { avg_processing_time: '45 mins', manual_steps: 18, systems_touched: 6, human_handoffs: 4 },
            after: { avg_processing_time: '9 mins', manual_steps: 3, systems_touched: 2, human_handoffs: 1 },
            time_reduction_pct: 80.0,
            manual_steps_saved: 15
          },
          policy_servicing: {
            workflow: 'Policy Servicing & Endorsements',
            before: { avg_processing_time: '24 mins', manual_steps: 11, systems_touched: 4, human_handoffs: 2 },
            after: { avg_processing_time: '2 mins', manual_steps: 2, systems_touched: 1, human_handoffs: 0 },
            time_reduction_pct: 91.7,
            manual_steps_saved: 9
          }
        }
      }
    }
  }

  // 3. Submissions routes
  if (normPath.startsWith('/submissions')) {
    if (normPath === '/submissions' && m === 'GET') {
      return { status: 200, data: state.submissions }
    }
    if (normPath === '/submissions' && m === 'POST') {
      const newSub = {
        id: `SUB-${String(state.submissions.length + 1).padStart(3, '0')}`,
        broker_id: data.broker_id || 'BRK-001',
        applicant_name: data.applicant_name,
        line_of_business: data.line_of_business,
        initial_email_text: data.initial_email_text || 'Direct broker intake.',
        status: 'submitted',
        created_at: new Date().toISOString(),
        documents: []
      }
      state.submissions.unshift(newSub)
      persist()
      return { status: 201, data: newSub }
    }
    const analyzeMatch = normPath.match(/^\/submissions\/([^/]+)\/analyze$/)
    if (analyzeMatch && m === 'POST') {
      const subId = analyzeMatch[1]
      const sub = state.submissions.find((s) => s.id === subId)
      if (sub) {
        sub.status = 'analyzed'
        persist()
      }
      return {
        status: 200,
        data: {
          submission_id: subId,
          status: 'analyzed',
          results: {
            completeness: {
              score: 92,
              status: 'complete',
              missing_items: [],
              checklist: [
                { item: 'ACORD 125 Application', present: true },
                { item: 'Prior 3-Year Loss Runs', present: true },
                { item: 'Statement of Values (SOV)', present: true }
              ]
            },
            risk_summary: {
              industry_classification: 'Commercial Logistics & Warehousing',
              appetite_fit: 'Strong Accept',
              estimated_premium: '$14,200',
              key_exposures: ['Heavy commercial truck ingress/egress', 'High-piled storage sprinkler clearances'],
              recommendation: 'Bind quote subject to standard fire sprinkler inspection certificate.'
            }
          }
        }
      }
    }
    const statusMatch = normPath.match(/^\/submissions\/([^/]+)\/workflow-status$/)
    if (statusMatch && m === 'GET') {
      return {
        status: 200,
        data: {
          submission_id: statusMatch[1],
          current_step: 'complete',
          status: 'completed'
        }
      }
    }
    const getMatch = normPath.match(/^\/submissions\/([^/]+)$/)
    if (getMatch && m === 'GET') {
      const sub = state.submissions.find((s) => s.id === getMatch[1])
      if (sub) return { status: 200, data: sub }
      return { status: 404, data: { detail: 'Submission not found' } }
    }
  }

  // 4. Claims routes
  if (normPath.startsWith('/claims')) {
    if (normPath === '/claims' && m === 'GET') {
      return { status: 200, data: state.claims }
    }
    if (normPath === '/claims' && m === 'POST') {
      const newClaim = {
        id: `CLM-${String(state.claims.length + 1).padStart(3, '0')}`,
        policy_id: data.policy_id,
        customer_id: data.customer_id || 'CUST-001',
        incident_date: data.incident_date || new Date().toISOString(),
        amount_claimed: Number(data.amount_claimed) || 0,
        claim_type: data.claim_type || 'auto_collision',
        description: data.description || '',
        incident_location: data.incident_location || '',
        status: 'reported',
        created_at: new Date().toISOString(),
        documents: []
      }
      state.claims.unshift(newClaim)
      persist()
      return { status: 201, data: newClaim }
    }
    const adjudicateMatch = normPath.match(/^\/claims\/([^/]+)\/adjudicate$/)
    if (adjudicateMatch && m === 'POST') {
      const claimId = adjudicateMatch[1]
      const claim = state.claims.find((c) => c.id === claimId)
      const isHighAmount = (claim?.amount_claimed || 0) > 10000
      const newStatus = isHighAmount || claim?.is_suspicious ? 'pending_approval' : 'approved'
      if (claim) {
        claim.status = newStatus
        persist()
      }
      return {
        status: 200,
        data: {
          claim_id: claimId,
          status: 'adjudicated',
          results: {
            status: newStatus,
            coverage_validation: {
              policy_active: true,
              coverage_applies: true,
              deductible: 500,
              coverage_limit: 100000
            },
            fraud_assessment: {
              fraud_risk_score: claim?.is_suspicious ? 82 : 12,
              anomaly_flags: claim?.is_suspicious ? ['Repair estimate exceeds market rate by 300%'] : [],
              recommendation: isHighAmount || claim?.is_suspicious ? 'Escalate for Senior Adjuster Review' : 'Auto-Approve Straight Through'
            },
            decision: {
              payout_amount: Math.max(0, (claim?.amount_claimed || 0) - 500),
              requires_human_signoff: isHighAmount || Boolean(claim?.is_suspicious)
            }
          }
        }
      }
    }
    const getClaimMatch = normPath.match(/^\/claims\/([^/]+)$/)
    if (getClaimMatch && m === 'GET') {
      const claim = state.claims.find((c) => c.id === getClaimMatch[1])
      if (claim) return { status: 200, data: claim }
      return { status: 404, data: { detail: 'Claim not found' } }
    }
  }

  // 5. Policy Service routes
  if (normPath.startsWith('/policy-service')) {
    if (normPath === '/policy-service' && m === 'GET') {
      return { status: 200, data: state.policyServices }
    }
    if (normPath === '/policy-service' && m === 'POST') {
      const newReq = {
        id: `PSR-${String(state.policyServices.length + 1).padStart(3, '0')}`,
        policy_id: data.policy_id,
        customer_id: data.customer_id || 'CUST-001',
        request_type: data.request_type,
        description: data.description || '',
        requested_changes: data.requested_changes || {},
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      state.policyServices.unshift(newReq)
      persist()
      return { status: 201, data: newReq }
    }
    const processMatch = normPath.match(/^\/policy-service\/([^/]+)\/process$/)
    if (processMatch && m === 'POST') {
      const reqId = processMatch[1]
      const req = state.policyServices.find((p) => p.id === reqId)
      const isAutoExec = req?.request_type === 'address_change' || req?.request_type === 'certificate_request'
      const finalStatus = isAutoExec ? 'resolved' : 'pending_approval'
      if (req) {
        req.status = finalStatus
        persist()
      }
      return {
        status: 200,
        data: {
          request_id: reqId,
          status: 'processed',
          results: {
            status: finalStatus,
            intent_detected: req?.request_type,
            autonomy_level: isAutoExec ? 'Level 3 (Execute - Straight Through)' : 'Level 2 (Recommend with Human Approval)',
            core_system_updated: isAutoExec,
            confirmation_notice: isAutoExec ? 'Updated policy master record in Policy Administration System.' : 'Prepared endorsement package awaiting approval.'
          }
        }
      }
    }
    const getReqMatch = normPath.match(/^\/policy-service\/([^/]+)$/)
    if (getReqMatch && m === 'GET') {
      const req = state.policyServices.find((p) => p.id === getReqMatch[1])
      if (req) return { status: 200, data: req }
      return { status: 404, data: { detail: 'Request not found' } }
    }
  }

  // 6. Approvals routes
  if (normPath.startsWith('/approvals')) {
    if (normPath === '/approvals' && m === 'GET') {
      return { status: 200, data: state.approvals }
    }
    const actionMatch = normPath.match(/^\/approvals\/([^/]+)\/(approve|reject|request-info)$/)
    if (actionMatch && m === 'POST') {
      const app = state.approvals.find((a) => a.id === actionMatch[1])
      if (app) {
        app.status = actionMatch[2] === 'approve' ? 'approved' : actionMatch[2] === 'reject' ? 'rejected' : 'info_requested'
        persist()
        return { status: 200, data: app }
      }
    }
  }

  // 7. Knowledge routes
  if (normPath.startsWith('/knowledge')) {
    if (normPath === '/knowledge/documents' && m === 'GET') {
      return { status: 200, data: state.knowledgeDocs }
    }
    if (normPath === '/knowledge/documents' && m === 'POST') {
      const newDoc = {
        id: `KDOC-${String(state.knowledgeDocs.length + 1).padStart(3, '0')}`,
        title: data.title,
        doc_type: data.doc_type,
        version: data.version || '1.0',
        content: data.content,
        created_at: new Date().toISOString()
      }
      state.knowledgeDocs.unshift(newDoc)
      persist()
      return { status: 201, data: newDoc }
    }
    if (normPath === '/knowledge/search' && m === 'POST') {
      const q = (data.query || '').toLowerCase()
      const citations = state.knowledgeDocs
        .filter((d) => !q || d.title.toLowerCase().includes(q) || d.content.toLowerCase().includes(q))
        .map((d, i) => ({
          document_id: d.id,
          document_title: d.title,
          doc_type: d.doc_type,
          version: d.version,
          chunk_index: 0,
          content: d.content,
          relevance_score: 0.95 - i * 0.05
        }))

      return {
        status: 200,
        data: {
          query: data.query,
          citations,
          summary_synthesis: `Based on authoritative carrier guidelines in ${citations.length > 0 ? citations[0].document_title : 'internal manuals'}, the operational rule specifies: ${citations.length > 0 ? citations[0].content.slice(0, 180) : 'Standard criteria apply.'}...`
        }
      }
    }
  }

  // 8. Agent control plane routes
  if (normPath.startsWith('/agents')) {
    if (normPath === '/agents' && m === 'GET') {
      return {
        status: 200,
        data: [
          {
            id: 'AGENT-UW-INTAKE',
            name: 'Commercial Intake & ACORD Extraction Agent',
            description: 'Extracts insured profile, building schedule, and operations from ACORD 125/126/140 applications.',
            agent_type: 'extraction',
            risk_level: 'low',
            status: 'active',
            config: {
              model: 'gemini-1.5-pro',
              prompt_version: 'v2.4',
              autonomy_level: 'Level 3 (Execute)',
              allowed_tools: ['ocr_acord_parser', 'classify_document'],
              eval_score: 96.4,
              success_rate: 99.1
            }
          },
          {
            id: 'AGENT-UW-COMPLETE',
            name: 'Completeness & Missing Information Agent',
            description: 'Audits submissions against underwriting requirements checklists and flags deficiencies.',
            agent_type: 'rule_evaluation',
            risk_level: 'low',
            status: 'active',
            config: {
              model: 'gemini-1.5-flash',
              prompt_version: 'v1.9',
              autonomy_level: 'Level 3 (Execute)',
              allowed_tools: ['inspect_loss_runs', 'validate_financial_statements'],
              eval_score: 98.1,
              success_rate: 99.5
            }
          },
          {
            id: 'AGENT-UW-RISK',
            name: 'Risk Appetite & Summary Agent',
            description: 'Assesses ISO industry risk profile, carrier appetite alignment, and synthesizes underwriter briefs.',
            agent_type: 'analysis',
            risk_level: 'medium',
            status: 'active',
            config: {
              model: 'gemini-1.5-pro',
              prompt_version: 'v3.1',
              autonomy_level: 'Level 2 (Recommend)',
              allowed_tools: ['lookup_carrier_appetite', 'calculate_iso_risk'],
              eval_score: 94.7,
              success_rate: 97.8
            }
          },
          {
            id: 'AGENT-CLM-INTAKE',
            name: 'Claims Intake & FNOL Extraction Agent',
            description: 'Parses unstructured loss notices, police reports, and repair estimates.',
            agent_type: 'extraction',
            risk_level: 'low',
            status: 'active',
            config: {
              model: 'gemini-1.5-flash',
              prompt_version: 'v2.0',
              autonomy_level: 'Level 3 (Execute)',
              allowed_tools: ['extract_fnol_email', 'ocr_police_report'],
              eval_score: 95.8,
              success_rate: 98.9
            }
          },
          {
            id: 'AGENT-CLM-COVERAGE',
            name: 'Coverage & Policy Validation Agent',
            description: 'Validates policy dates, incident occurrences, exclusions, and deductibles.',
            agent_type: 'rule_evaluation',
            risk_level: 'medium',
            status: 'active',
            config: {
              model: 'gemini-1.5-flash',
              prompt_version: 'v2.2',
              autonomy_level: 'Level 3 (Execute)',
              allowed_tools: ['get_policy_details', 'check_loss_date_coverage'],
              eval_score: 99.2,
              success_rate: 99.8
            }
          },
          {
            id: 'AGENT-CLM-FRAUD',
            name: 'Fraud & Duplicate Detection Agent',
            description: 'Evaluates multi-factor fraud risk vectors, duplicate loss notices, and invoice inflation.',
            agent_type: 'risk_analysis',
            risk_level: 'high',
            status: 'active',
            config: {
              model: 'gemini-1.5-pro',
              prompt_version: 'v2.8',
              autonomy_level: 'Level 1 (Assist)',
              allowed_tools: ['cross_carrier_claim_search', 'estimate_inflation_checker'],
              eval_score: 91.5,
              success_rate: 96.2
            }
          },
          {
            id: 'AGENT-POL-SERVICE',
            name: 'Policy Servicing Governance & Execution Agent',
            description: 'Three-tier autonomy policy endorsement engine for address changes, endorsements, and COIs.',
            agent_type: 'orchestration',
            risk_level: 'medium',
            status: 'active',
            config: {
              model: 'gemini-1.5-pro',
              prompt_version: 'v3.0',
              autonomy_level: 'Level 3 (Execute) / Level 2 (Recommend)',
              allowed_tools: ['update_policy_master', 'generate_coi_certificate'],
              eval_score: 97.5,
              success_rate: 99.4
            }
          }
        ]
      }
    }
    if (normPath === '/agents/metrics' && m === 'GET') {
      return {
        status: 200,
        data: {
          activeAgents: 7,
          totalExecutions: 1428,
          successRate: 98.6,
          avgLatencyMs: 345,
          totalTokens: 1845000,
          estimatedCostUsd: 14.85,
          escalationsToHuman: 42
        }
      }
    }
    if (normPath.startsWith('/agents/runs') && m === 'GET') {
      return {
        status: 200,
        data: state.agentRuns
      }
    }
  }

  // 9. Audit trail routes
  if (normPath.startsWith('/audit')) {
    if (normPath === '/audit/summary' && m === 'GET') {
      return {
        status: 200,
        data: {
          total_events: 184,
          by_actor: { agent: 142, user: 34, system: 8 },
          by_entity: { submission: 82, claim: 64, policy_service: 38 },
          compliance_score: 99.8,
          regulatory_framework: 'NAIC Model Law & ISO 27001 Audit Ready'
        }
      }
    }
    if (normPath.startsWith('/audit') && m === 'GET') {
      const mockAuditEvents = [
        {
          id: 'AUD-8921',
          tenant_id: 'TEN-001',
          actor_type: 'agent',
          actor_id: 'AGENT-CLM-FRAUD',
          action: 'evaluate_fraud_anomaly_vector',
          entity_type: 'claim',
          entity_id: 'CLM-007',
          result: 'success',
          metadata_: {
            anomaly_detected: true,
            score: 82,
            reason: 'Repair estimate exceeds market rate by 300%',
            model: 'gemini-1.5-pro'
          },
          created_at: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          id: 'AUD-8920',
          tenant_id: 'TEN-001',
          actor_type: 'agent',
          actor_id: 'AGENT-UW-COMPLETE',
          action: 'audit_acord_submission',
          entity_type: 'submission',
          entity_id: 'SUB-001',
          result: 'success',
          metadata_: {
            completeness_score: 92,
            missing_items: [],
            verification: 'ACORD 125 & 140 validated'
          },
          created_at: new Date(Date.now() - 3600000 * 4).toISOString()
        },
        {
          id: 'AUD-8919',
          tenant_id: 'TEN-001',
          actor_type: 'user',
          actor_id: 'underwriter_lead',
          action: 'human_override_approval',
          entity_type: 'submission',
          entity_id: 'SUB-002',
          result: 'success',
          metadata_: {
            decision: 'approved_with_conditions',
            notes: 'Approved rooftop liquor liability rider with $25k deductible'
          },
          created_at: new Date(Date.now() - 3600000 * 7).toISOString()
        },
        {
          id: 'AUD-8918',
          tenant_id: 'TEN-001',
          actor_type: 'agent',
          actor_id: 'AGENT-POL-SERVICE',
          action: 'execute_straight_through_endorsement',
          entity_type: 'policy_service',
          entity_id: 'PSR-001',
          result: 'success',
          metadata_: {
            autonomy_tier: 'Level 3 (Execute)',
            updated_fields: ['address'],
            pas_transaction_id: 'PAS-TX-98421'
          },
          created_at: new Date(Date.now() - 3600000 * 29).toISOString()
        }
      ]
      return {
        status: 200,
        data: mockAuditEvents
      }
    }
  }

  return null
}
