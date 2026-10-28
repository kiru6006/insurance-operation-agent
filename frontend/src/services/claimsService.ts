import client from '../api/client'

export interface ClaimPayload {
  policy_id: string
  customer_id: string
  incident_date: string
  amount_claimed: number
  claim_type: string
  description?: string
  incident_location?: string
}

export interface ClaimDocument {
  id: string
  file_name: string
  file_path: string
  document_type: string
}

export interface ClaimAssessment {
  id: string
  assessment_type: string
  result: string
  confidence: number
}

export interface FraudSignal {
  id: string
  signal_type: string
  severity: string
  evidence?: string
}

export interface ClaimRecord {
  id: string
  policy_id: string
  customer_id: string
  incident_date: string
  amount_claimed: number
  claim_type: string
  description?: string
  incident_location?: string
  status: string
  created_at: string
  documents?: ClaimDocument[]
  assessments?: ClaimAssessment[]
  fraud_signals?: FraudSignal[]
  fnol_email?: string
}

export const claimsService = {
  listClaims: async (status?: string): Promise<ClaimRecord[]> => {
    const url = status ? `/claims?status=${status}` : '/claims'
    const res = await client.get(url)
    return res.data
  },

  getClaim: async (id: string): Promise<ClaimRecord> => {
    const res = await client.get(`/claims/${id}`)
    return res.data
  },

  createClaim: async (payload: ClaimPayload): Promise<ClaimRecord> => {
    const res = await client.post('/claims', payload)
    return res.data
  },

  adjudicateClaim: async (id: string, options?: { run_fraud_check?: boolean }) => {
    const res = await client.post(`/claims/${id}/adjudicate`, options || {})
    return res.data
  },

  getWorkflowStatus: async (id: string) => {
    const res = await client.get(`/claims/${id}/workflow-status`)
    return res.data
  }
}
