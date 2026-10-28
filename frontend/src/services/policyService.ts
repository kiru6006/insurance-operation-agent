import client from '../api/client'

export interface PolicyServicePayload {
  policy_id: string
  customer_id?: string
  request_type: string
  description?: string
  requested_changes?: Record<string, any>
}

export interface PolicyServiceRecord {
  id: string
  policy_id: string
  customer_id: string
  request_type: string
  description?: string
  requested_changes?: string
  status: string
  created_at: string
  updated_at: string
  policy_details?: any
}

export const policyService = {
  listRequests: async (status?: string): Promise<PolicyServiceRecord[]> => {
    const url = status ? `/policy-service?status=${status}` : '/policy-service'
    const res = await client.get(url)
    return res.data
  },

  getRequest: async (id: string): Promise<PolicyServiceRecord> => {
    const res = await client.get(`/policy-service/${id}`)
    return res.data
  },

  createRequest: async (payload: PolicyServicePayload): Promise<PolicyServiceRecord> => {
    const res = await client.post('/policy-service', payload)
    return res.data
  },

  processRequest: async (id: string, options?: { execute_update?: boolean }) => {
    const res = await client.post(`/policy-service/${id}/process`, options || { execute_update: true })
    return res.data
  },

  getWorkflowStatus: async (id: string) => {
    const res = await client.get(`/policy-service/${id}/workflow-status`)
    return res.data
  }
}
