import client from '../api/client'

export interface AgentConfig {
  model: string
  prompt_version: string
  autonomy_level: string
  allowed_tools: string[]
  eval_score: number
  success_rate: number
}

export interface RegisteredAgent {
  id: string
  name: string
  description?: string
  agent_type: string
  risk_level: string
  status: string
  config: AgentConfig
}


export interface AgentRunRecord {
  id: string
  agent_name: string
  action: string
  status: string
  latency_ms: number
  tokens_used: number
  created_at: string
  evidence_count?: number
}

export interface AgentMetrics {
  activeAgents: number
  totalExecutions: number
  successRate: number
  avgLatencyMs: number
  totalTokens: number
  estimatedCostUsd: number
  escalationsToHuman: number
}

export const agentControlService = {
  listAgents: async (): Promise<RegisteredAgent[]> => {
    const res = await client.get('/agents')
    return res.data
  },

  getMetrics: async (): Promise<AgentMetrics> => {
    const res = await client.get('/agents/metrics')
    return res.data
  },

  listRuns: async (limit: number = 50): Promise<AgentRunRecord[]> => {
    const res = await client.get(`/agents/runs?limit=${limit}`)
    return res.data
  }
}
