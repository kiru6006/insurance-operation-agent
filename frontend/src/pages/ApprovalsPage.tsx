import React, { useEffect, useState } from 'react'
import client from '../api/client'

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApprovals()
  }, [])

  const fetchApprovals = async () => {
    try {
      const res = await client.get('/approvals')
      setApprovals(res.data)
    } catch (err) {
      console.error('Error fetching approvals:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (id: string, action: 'approve' | 'reject' | 'request-info') => {
    try {
      await client.post(`/approvals/${id}/${action}`, { reason: `Action executed: ${action}` })
      setApprovals((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'info_requested' } : a))
      )
    } catch (err) {
      console.error(`Failed to execute ${action}:`, err)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Underwriting Approvals Inbox</h1>
        <p className="text-gray-400 text-sm mt-1">Human-in-the-loop decisions for flagged underwriting exposures.</p>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading pending approval queue...</div>
        ) : approvals.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No items requiring approval.</div>
        ) : (
          <div className="divide-y divide-gray-700/60">
            {approvals.map((app) => (
              <div key={app.id} className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-blue-400">{app.id}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300">{app.submission_id}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded uppercase font-bold ${
                        app.severity === 'high' ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {app.severity} risk
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded uppercase font-semibold text-emerald-300 bg-emerald-950/60">
                      {app.status}
                    </span>
                  </div>
                  <h3 className="text-white font-medium text-sm">{app.applicant_name}</h3>
                  <p className="text-gray-400 text-xs">{app.action_required}</p>
                </div>

                {app.status === 'pending' ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAction(app.id, 'approve')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded transition"
                    >
                      Approve & Bind
                    </button>
                    <button
                      onClick={() => handleAction(app.id, 'request-info')}
                      className="bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs font-semibold px-3 py-1.5 rounded transition"
                    >
                      Request Info
                    </button>
                    <button
                      onClick={() => handleAction(app.id, 'reject')}
                      className="bg-red-700 hover:bg-red-800 text-white text-xs font-semibold px-3 py-1.5 rounded transition"
                    >
                      Decline
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400 italic">Decision Recorded</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
