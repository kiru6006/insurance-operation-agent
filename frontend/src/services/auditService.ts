import client from '../api/client'

export interface AuditEventRecord {
  id: string
  tenant_id: string
  actor_type: string
  actor_id: string
  action: string
  entity_type: string
  entity_id: string
  result: string
  metadata_?: Record<string, any>
  created_at: string
}

export interface AuditSummary {
  total_events: number
  by_actor: Record<string, number>
  by_entity: Record<string, number>
  compliance_score: number
  regulatory_framework: string
}

export const auditService = {
  listEvents: async (entityType?: string, actorType?: string, limit: number = 100): Promise<AuditEventRecord[]> => {
    let url = `/audit?limit=${limit}`
    if (entityType) url += `&entity_type=${entityType}`
    if (actorType) url += `&actor_type=${actorType}`
    const res = await client.get(url)
    return res.data
  },

  getSummary: async (): Promise<AuditSummary> => {
    const res = await client.get('/audit/summary')
    return res.data
  }
}
