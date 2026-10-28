import client from '../api/client'

export interface ProcessBenchmarkSummary {
  manual_steps_before: number
  automated_steps_after: number
  systems_touched_before: number
  systems_touched_after: number
  human_handoffs_before: number
  human_handoffs_after: number
  processing_time_before: string
  processing_time_after: string
  manual_reduction_pct: number
}

export interface StepComparison {
  step: number
  manual: string
  automated: string
  type: 'automated' | 'eliminated' | 'human'
}

export interface WorkflowProcessMap {
  title: string
  benchmark_summary: ProcessBenchmarkSummary
  steps_comparison: StepComparison[]
}

export const operationsIntelligenceService = {
  getProcessMaps: async (): Promise<Record<string, WorkflowProcessMap>> => {
    const res = await client.get('/operations-intelligence/process-maps')
    return res.data
  }
}
