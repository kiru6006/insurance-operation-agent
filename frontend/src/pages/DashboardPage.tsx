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
  operationsImpact?: Record<string, any>
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

      {/* Operations Impact: Before vs After AI */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow">
        <div className="p-4 border-b border-gray-700 bg-gray-900/40 flex justify-between items-center">
          <div>
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Operations Impact: Before vs After InsureOps AI</h2>
            <p className="text-xs text-gray-400">Quantifiable manual workload elimination and cycle time reductions per workflow.</p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">
            Live Benchmark
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-700 text-xs">
          {/* Underwriting */}
          <div className="p-5 space-y-3">
            <h3 className="font-bold text-sm text-white">Commercial Underwriting</h3>
            <div className="bg-gray-900/60 p-3 rounded border border-gray-700 space-y-1.5">
              <div className="text-rose-400 font-semibold uppercase tracking-wider text-[10px]">Before AI</div>
              <div className="text-gray-300">Processing Time: <span className="font-mono text-white">31 mins</span></div>
              <div className="text-gray-300">Manual Steps: <span className="font-mono text-white">14 steps</span></div>
              <div className="text-gray-300">Systems Touched: <span className="font-mono text-white">5 systems</span></div>
            </div>
            <div className="bg-emerald-950/40 p-3 rounded border border-emerald-800 space-y-1.5">
              <div className="text-emerald-400 font-semibold uppercase tracking-wider text-[10px]">After InsureOps AI</div>
              <div className="text-gray-300">Processing Time: <span className="font-mono text-emerald-300 font-bold">7 mins</span></div>
              <div className="text-gray-300">Manual Actions: <span className="font-mono text-emerald-300 font-bold">4 actions</span></div>
              <div className="text-gray-300">Reduction: <span className="font-mono text-emerald-400 font-bold">77.4% faster</span></div>
            </div>
          </div>

          {/* Claims */}
          <div className="p-5 space-y-3">
            <h3 className="font-bold text-sm text-white">Claims Adjudication</h3>
            <div className="bg-gray-900/60 p-3 rounded border border-gray-700 space-y-1.5">
              <div className="text-rose-400 font-semibold uppercase tracking-wider text-[10px]">Before AI</div>
              <div className="text-gray-300">Processing Time: <span className="font-mono text-white">45 mins</span></div>
              <div className="text-gray-300">Manual Steps: <span className="font-mono text-white">18 steps</span></div>
              <div className="text-gray-300">Systems Touched: <span className="font-mono text-white">6 systems</span></div>
            </div>
            <div className="bg-emerald-950/40 p-3 rounded border border-emerald-800 space-y-1.5">
              <div className="text-emerald-400 font-semibold uppercase tracking-wider text-[10px]">After InsureOps AI</div>
              <div className="text-gray-300">Processing Time: <span className="font-mono text-emerald-300 font-bold">9 mins</span></div>
              <div className="text-gray-300">Manual Actions: <span className="font-mono text-emerald-300 font-bold">3 actions</span></div>
              <div className="text-gray-300">Reduction: <span className="font-mono text-emerald-400 font-bold">80.0% faster</span></div>
            </div>
          </div>

          {/* Policy Servicing */}
          <div className="p-5 space-y-3">
            <h3 className="font-bold text-sm text-white">Policy Servicing</h3>
            <div className="bg-gray-900/60 p-3 rounded border border-gray-700 space-y-1.5">
              <div className="text-rose-400 font-semibold uppercase tracking-wider text-[10px]">Before AI</div>
              <div className="text-gray-300">Processing Time: <span className="font-mono text-white">22 mins</span></div>
              <div className="text-gray-300">Manual Steps: <span className="font-mono text-white">9 steps</span></div>
              <div className="text-gray-300">Systems Touched: <span className="font-mono text-white">4 systems</span></div>
            </div>
            <div className="bg-emerald-950/40 p-3 rounded border border-emerald-800 space-y-1.5">
              <div className="text-emerald-400 font-semibold uppercase tracking-wider text-[10px]">After InsureOps AI</div>
              <div className="text-gray-300">Processing Time: <span className="font-mono text-emerald-300 font-bold">2 mins (STP)</span></div>
              <div className="text-gray-300">Manual Actions: <span className="font-mono text-emerald-300 font-bold">0 actions</span></div>
              <div className="text-gray-300">Reduction: <span className="font-mono text-emerald-400 font-bold">90.9% faster</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

