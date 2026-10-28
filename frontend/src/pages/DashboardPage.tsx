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
  totalServiceRequests?: number
  servicingStraightThrough?: number
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
    totalServiceRequests: 0,
    servicingStraightThrough: 0
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
        <p className="text-gray-400 text-sm mt-1">Real-time metrics across Commercial Underwriting, Claims Adjudication, and Policy Servicing.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 shadow">
          <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Submissions</div>
          <div className="text-3xl font-bold text-white mt-2 font-mono">{metrics.casesReceived}</div>
          <div className="text-xs text-gray-500 mt-2">Dossier intake queue</div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 shadow">
          <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Claims Ingested</div>
          <div className="text-3xl font-bold text-white mt-2 font-mono">{metrics.totalClaims ?? 20}</div>
          <div className="text-xs text-gray-500 mt-2">FNOL dossiers logged</div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 shadow">
          <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Claims Auto-Approved</div>
          <div className="text-3xl font-bold text-emerald-400 mt-2 font-mono">{metrics.claimsAutoAdjudicated ?? 0}</div>
          <div className="text-xs text-gray-500 mt-2">Fast-track payout</div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 shadow">
          <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Service Requests</div>
          <div className="text-3xl font-bold text-purple-400 mt-2 font-mono">{metrics.totalServiceRequests ?? 15}</div>
          <div className="text-xs text-gray-500 mt-2">Endorsements & changes</div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 shadow">
          <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Automation Rate</div>
          <div className="text-3xl font-bold text-blue-400 mt-2 font-mono">{metrics.automationRate}%</div>
          <div className="text-xs text-gray-500 mt-2">Straight-through ratio</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 shadow">
          <h2 className="text-base font-semibold text-white mb-2">Commercial Underwriting</h2>
          <p className="text-gray-300 text-xs leading-relaxed">
            Multi-agent intake classification, ACORD document audits, and risk vector extraction active across commercial lines.
          </p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 shadow">
          <h2 className="text-base font-semibold text-white mb-2">Claims Adjudication</h2>
          <p className="text-gray-300 text-xs leading-relaxed">
            First Notice of Loss extraction, coverage verification, deductible checks, and forensic fraud signal detection.
          </p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 shadow">
          <h2 className="text-base font-semibold text-white mb-2">Policy Servicing</h2>
          <p className="text-gray-300 text-xs leading-relaxed">
            Three-tier autonomy governance: Level 3 Straight-Through mutations, Level 2 recommendations, and Level 1 underwriter sign-offs.
          </p>
        </div>
      </div>
    </div>
  )
}

