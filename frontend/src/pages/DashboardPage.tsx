import { useEffect, useState } from 'react'
import client from '../api/client'
import { operationsIntelligenceService, WorkflowProcessMap } from '../services/operationsIntelligenceService'

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

  const [processMaps, setProcessMaps] = useState<Record<string, WorkflowProcessMap> | null>(null)
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<string>('commercial_underwriting')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsRes, mapsData] = await Promise.all([
          client.get('/dashboard/metrics'),
          operationsIntelligenceService.getProcessMaps()
        ])
        setMetrics(metricsRes.data)
        setProcessMaps(mapsData)
      } catch (err) {
        console.error('Failed to fetch dashboard intelligence data', err)
      }
    }

    fetchData()
  }, [])

  const currentMap = processMaps ? processMaps[activeWorkflowTab] : null

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Insurance Operations Overview</h1>
        <p className="text-gray-400 text-sm mt-1">Real-time metrics and operations intelligence across Commercial Underwriting, Claims Adjudication, and Policy Servicing.</p>
      </div>

      {/* Top Metric Cards */}
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
          <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Auto Adjudicated</div>
          <div className="text-3xl font-bold text-emerald-400 mt-2 font-mono">{metrics.claimsAutoAdjudicated ?? 8}</div>
          <div className="text-xs text-gray-500 mt-2">Straight-through payments</div>
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

      {/* Operations Intelligence Section 58 Interactive Visualizer */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow">
        <div className="p-5 border-b border-gray-700 bg-gray-900/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide">Operations Intelligence: Workflow Process Dissector</h2>
              <span className="text-[10px] uppercase font-bold bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded">
                Section 58 Architecture
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Side-by-side comparison of manual legacy human tasks versus InsureOps AI autonomous workflow orchestration.
            </p>
          </div>

          {/* Workflow Tabs */}
          <div className="flex gap-1.5 bg-gray-950 p-1 rounded-lg border border-gray-800">
            <button
              onClick={() => setActiveWorkflowTab('commercial_underwriting')}
              className={`px-3 py-1 text-xs font-semibold rounded transition ${
                activeWorkflowTab === 'commercial_underwriting'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Underwriting
            </button>
            <button
              onClick={() => setActiveWorkflowTab('claims_adjudication')}
              className={`px-3 py-1 text-xs font-semibold rounded transition ${
                activeWorkflowTab === 'claims_adjudication'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Claims
            </button>
            <button
              onClick={() => setActiveWorkflowTab('policy_servicing')}
              className={`px-3 py-1 text-xs font-semibold rounded transition ${
                activeWorkflowTab === 'policy_servicing'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Servicing
            </button>
          </div>
        </div>

        {currentMap && (
          <div className="p-6 space-y-6">
            {/* High-level benchmark pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-gray-900/80 p-3 rounded border border-gray-700">
                <div className="text-gray-500 font-semibold uppercase text-[10px]">Processing Time</div>
                <div className="text-white font-mono mt-1">
                  <span className="line-through text-rose-400 mr-2">{currentMap.benchmark_summary.processing_time_before}</span>
                  <span className="text-emerald-400 font-bold">{currentMap.benchmark_summary.processing_time_after}</span>
                </div>
              </div>
              <div className="bg-gray-900/80 p-3 rounded border border-gray-700">
                <div className="text-gray-500 font-semibold uppercase text-[10px]">Manual Touches</div>
                <div className="text-white font-mono mt-1">
                  <span className="text-rose-400 mr-1">{currentMap.benchmark_summary.manual_steps_before} steps</span>
                  &rarr; <span className="text-emerald-400 font-bold ml-1">{currentMap.benchmark_summary.automated_steps_after} actions</span>
                </div>
              </div>
              <div className="bg-gray-900/80 p-3 rounded border border-gray-700">
                <div className="text-gray-500 font-semibold uppercase text-[10px]">Systems Touched</div>
                <div className="text-white font-mono mt-1">
                  <span className="text-gray-400">{currentMap.benchmark_summary.systems_touched_before} legacy</span>
                  &rarr; <span className="text-blue-400 font-bold ml-1">{currentMap.benchmark_summary.systems_touched_after} unified</span>
                </div>
              </div>
              <div className="bg-emerald-950/40 p-3 rounded border border-emerald-800">
                <div className="text-emerald-400 font-semibold uppercase text-[10px]">Workload Eliminated</div>
                <div className="text-emerald-300 font-bold font-mono text-base mt-0.5">
                  {currentMap.benchmark_summary.manual_reduction_pct}% reduction
                </div>
              </div>
            </div>

            {/* Step by step timeline */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Execution Steps Breakdown ({currentMap.steps_comparison.length} stages)
              </div>
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-2">
                {currentMap.steps_comparison.map((item) => (
                  <div
                    key={item.step}
                    className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 rounded bg-gray-900/60 border border-gray-800 text-xs items-center"
                  >
                    <div className="md:col-span-1 font-mono font-bold text-gray-500">#{item.step}</div>
                    <div className="md:col-span-5 text-gray-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                      <span>{item.manual}</span>
                    </div>
                    <div className="md:col-span-1 text-center text-gray-600 font-bold hidden md:block">&rarr;</div>
                    <div className="md:col-span-5 text-white flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            item.type === 'human'
                              ? 'bg-amber-400'
                              : item.type === 'eliminated'
                              ? 'bg-gray-500'
                              : 'bg-emerald-400'
                          }`}
                        ></span>
                        <span className="font-medium">{item.automated}</span>
                      </div>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold uppercase ${
                          item.type === 'human'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : item.type === 'eliminated'
                            ? 'bg-gray-800 text-gray-400'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {item.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
