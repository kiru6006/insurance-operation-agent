import React, { useEffect, useState } from 'react'
import { agentControlService, RegisteredAgent, AgentMetrics, AgentRunRecord } from '../services/agentControlService'

export default function AgentControlPlanePage() {
  const [agents, setAgents] = useState<RegisteredAgent[]>([])
  const [metrics, setMetrics] = useState<AgentMetrics | null>(null)
  const [runs, setRuns] = useState<AgentRunRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agentsData, metricsData, runsData] = await Promise.all([
          agentControlService.listAgents(),
          agentControlService.getMetrics(),
          agentControlService.listRuns(15)
        ])
        setAgents(agentsData)
        setMetrics(metricsData)
        setRuns(runsData)
      } catch (err) {
        console.error('Failed to load agent control plane telemetry:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Agent Control Plane & Observability</h1>
        <p className="text-gray-400 text-sm mt-1">
          Governance registry, autonomy permissions, evaluation scoring, and real-time execution telemetry.
        </p>
      </div>

      {/* Metrics Row */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 shadow">
            <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Registered Agents</div>
            <div className="text-3xl font-bold text-white mt-2 font-mono">{metrics.activeAgents}</div>
            <div className="text-xs text-gray-500 mt-2">Active in operating layer</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 shadow">
            <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Success Rate</div>
            <div className="text-3xl font-bold text-emerald-400 mt-2 font-mono">{metrics.successRate}%</div>
            <div className="text-xs text-gray-500 mt-2">Evaluation accuracy benchmark</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 shadow">
            <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Avg Latency</div>
            <div className="text-3xl font-bold text-blue-400 mt-2 font-mono">{metrics.avgLatencyMs}ms</div>
            <div className="text-xs text-gray-500 mt-2">Inference & tool roundtrip</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 shadow">
            <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Token Footprint</div>
            <div className="text-3xl font-bold text-purple-400 mt-2 font-mono">{metrics.totalTokens.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-2">Cost: ${metrics.estimatedCostUsd}</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 shadow">
            <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Human Escalations</div>
            <div className="text-3xl font-bold text-amber-400 mt-2 font-mono">{metrics.escalationsToHuman}</div>
            <div className="text-xs text-gray-500 mt-2">Triaged to Approvals</div>
          </div>
        </div>
      )}

      {/* Agents Registry Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow">
        <div className="p-4 border-b border-gray-700 bg-gray-900/40 flex justify-between items-center">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Agent Policy & Governance Registry</h2>
          <span className="text-xs text-gray-400 font-mono">RBAC + Three-Tier Autonomy Active</span>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading agents...</div>
        ) : (
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-900/40 text-gray-400 text-xs font-semibold uppercase">
                <th className="py-3 px-4">Agent Name</th>
                <th className="py-3 px-4">Risk Tier</th>
                <th className="py-3 px-4">Autonomy Level</th>
                <th className="py-3 px-4">Model & Prompt</th>
                <th className="py-3 px-4">Allowed Tools</th>
                <th className="py-3 px-4 text-right">Eval Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/60">
              {agents.map((agent) => (
                <tr key={agent.id} className="hover:bg-gray-700/30 transition">
                  <td className="py-3.5 px-4 font-medium text-white">
                    {agent.name}
                    <div className="text-xs text-gray-400 truncate max-w-xs">{agent.description}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        agent.risk_level === 'high'
                          ? 'bg-rose-950/60 text-rose-300 border border-rose-800'
                          : agent.risk_level === 'medium'
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-800'
                          : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {agent.risk_level.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs font-semibold text-blue-400">
                    {agent.config?.autonomy_level || 'ASSIST'}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-gray-300 font-mono">
                    {agent.config?.model} <span className="text-gray-500">({agent.config?.prompt_version})</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {agent.config?.allowed_tools?.map((tool, idx) => (
                        <span key={idx} className="text-xs bg-gray-900 border border-gray-700 px-1.5 py-0.5 rounded text-gray-300 font-mono">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                    {((agent.config?.eval_score || 0.95) * 100).toFixed(0)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Live Observability Telemetry Stream */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow">
        <div className="p-4 border-b border-gray-700 bg-gray-900/40 flex justify-between items-center">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Live Agent Run Telemetry Stream</h2>
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Streaming
          </span>
        </div>
        <div className="divide-y divide-gray-700">
          {runs.map((run) => (
            <div key={run.id} className="p-3.5 hover:bg-gray-700/30 flex justify-between items-center text-xs transition">
              <div className="flex items-center gap-3">
                <span className="font-mono text-blue-400 font-semibold">{run.agent_name || 'Agent Execution'}</span>
                <span className="text-gray-400">→</span>
                <span className="text-gray-200 font-mono">{run.action || 'workflow_step'}</span>
              </div>
              <div className="flex items-center gap-4 text-gray-400 font-mono">
                <span>{run.latency_ms}ms</span>
                <span>{run.tokens_used} tokens</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase font-bold text-[10px]">
                  {run.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
