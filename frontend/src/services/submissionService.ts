import client from '../api/client'

export interface SubmissionPayload {
  broker_id: string
  applicant_name: string
  line_of_business: string
  initial_email_text?: string
}

export const submissionService = {
  listSubmissions: async (status?: string) => {
    const url = status ? `/submissions?status=${status}` : '/submissions'
    const res = await client.get(url)
    return res.data
  },

  getSubmission: async (id: string) => {
    const res = await client.get(`/submissions/${id}`)
    return res.data
  },

  createSubmission: async (payload: SubmissionPayload) => {
    const res = await client.post('/submissions', payload)
    return res.data
  },

  uploadDocument: async (submissionId: string, file: File, documentType: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('document_type', documentType)
    // Upload endpoint or simulated upload response
    return {
      id: `DOC-${Date.now()}`,
      file_name: file.name,
      document_type: documentType,
      file_path: `/storage/${submissionId}/${file.name}`
    }
  },

  analyzeSubmission: async (id: string) => {
    const res = await client.post(`/submissions/${id}/analyze`)
    return res.data
  },

  getWorkflowStatus: async (id: string) => {
    const res = await client.get(`/submissions/${id}/workflow-status`)
    return res.data
  }
}
