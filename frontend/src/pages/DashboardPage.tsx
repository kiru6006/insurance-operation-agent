import { useEffect, useState } from 'react'
import client from '../api/client'

interface DashboardMetrics {
  casesReceived: number
  aiProcessed: number
  pendingReview: number
  automationRate: number
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    casesReceived: 0,
    aiProcessed: 0,
    pendingReview: 0,
    automationRate: 0,
  })

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await client.get('/dashboard/metrics')
        setMetrics(res.data)
      } catch (err) {
        console.error('Failed to fetch metrics', err)
      }
    }

    fetchMetrics()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Insurance Operations Overview</h1>
        <p className="text-gray-400 text-sm mt-1">Real-time metrics for Underwriting Submissions and AI agent throughput.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow">
          <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Submissions Received</div>
          <div className="text-4xl font-bold text-white mt-2 font-mono">{metrics.casesReceived}</div>
          <div className="text-xs text-gray-500 mt-2">Total dossier intake volume</div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow">
          <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">AI Processed</div>
          <div className="text-4xl font-bold text-emerald-400 mt-2 font-mono">{metrics.aiProcessed}</div>
          <div className="text-xs text-gray-500 mt-2">Dossiers analyzed by agents</div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow">
          <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Pending Review</div>
          <div className="text-4xl font-bold text-amber-400 mt-2 font-mono">{metrics.pendingReview}</div>
          <div className="text-xs text-gray-500 mt-2">Awaiting underwriter bind</div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow">
          <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Automation Rate</div>
          <div className="text-4xl font-bold text-blue-400 mt-2 font-mono">{metrics.automationRate}%</div>
          <div className="text-xs text-gray-500 mt-2">Straight-through triage ratio</div>
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow">
        <h2 className="text-lg font-semibold text-white mb-2">Phase 2 Status: Operational</h2>
        <p className="text-gray-300 text-sm leading-relaxed">
          Commercial Underwriting Submission pipeline is active. AI agents perform automatic intake classification, ACORD document audits, and risk factor extraction. High-risk exposures are routed to the Approvals Inbox for human oversight.
        </p>
      </div>
    </div>
  )
}

