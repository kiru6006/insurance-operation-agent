import { useEffect, useState } from 'react'

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
        setMetrics({
          casesReceived: 24,
          aiProcessed: 18,
          pendingReview: 6,
          automationRate: 75,
        })
      } catch (err) {
        console.error('Failed to fetch metrics', err)
      }
    }

    fetchMetrics()
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 border border-gray-700 rounded p-6">
          <div className="text-gray-400 text-sm font-medium">Cases Received</div>
          <div className="text-4xl font-bold text-white mt-2">{metrics.casesReceived}</div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded p-6">
          <div className="text-gray-400 text-sm font-medium">AI Processed</div>
          <div className="text-4xl font-bold text-white mt-2">{metrics.aiProcessed}</div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded p-6">
          <div className="text-gray-400 text-sm font-medium">Pending Review</div>
          <div className="text-4xl font-bold text-white mt-2">{metrics.pendingReview}</div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded p-6">
          <div className="text-gray-400 text-sm font-medium">Automation Rate</div>
          <div className="text-4xl font-bold text-white mt-2">{metrics.automationRate}%</div>
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Status</h2>
        <p className="text-gray-400">Platform initialized. PHASE 1 complete.</p>
      </div>
    </div>
  )
}
