import { useEffect, useState } from 'react'
import client from '../api/client'

interface DashboardMetrics {
  casesReceived: number
  aiProcessed: number
  pendingReview: number
  automationRate: number
  totalClaims?: number
  claimsAutoAdjudicated?: number
  claimsUnderReview?: number
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    casesReceived: 0,
    aiProcessed: 0,
    pendingReview: 0,
    automationRate: 0,
    totalClaims: 0,
    claimsAutoAdjudicated: 0,
    claimsUnderReview: 0,
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
        <p className="text-gray-400 text-sm mt-1">Real-time metrics for Commercial Underwriting and Automated Claims Adjudication.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow">
          <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Submissions Received</div>
          <div className="text-4xl font-bold text-white mt-2 font-mono">{metrics.casesReceived}</div>
          <div className="text-xs text-gray-500 mt-2">Commercial underwriting intake</div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow">
          <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Claims Ingested</div>
          <div className="text-4xl font-bold text-white mt-2 font-mono">{metrics.totalClaims ?? 20}</div>
          <div className="text-xs text-gray-500 mt-2">FNOL dossiers logged</div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow">
          <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Claims Fast-Tracked</div>
          <div className="text-4xl font-bold text-emerald-400 mt-2 font-mono">{metrics.claimsAutoAdjudicated ?? 0}</div>
          <div className="text-xs text-gray-500 mt-2">Auto-approved without adjuster intervention</div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow">
          <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Automation Rate</div>
          <div className="text-4xl font-bold text-blue-400 mt-2 font-mono">{metrics.automationRate}%</div>
          <div className="text-xs text-gray-500 mt-2">Tri-agent triage efficiency</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow">
          <h2 className="text-lg font-semibold text-white mb-2">Commercial Underwriting Pipeline</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Multi-agent intake classification, ACORD document completeness validation, and risk vector extraction active across commercial property, general liability, cyber, auto, and workers compensation.
          </p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow">
          <h2 className="text-lg font-semibold text-white mb-2">Automated Claims Adjudication</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            First Notice of Loss (FNOL) parsing, policy coverage/deductible constraint validation, and multi-factor fraud detection. Suspicious invoices and high severity claims automatically escalate to SIU Approvals.
          </p>
        </div>
      </div>
    </div>
  )
}

