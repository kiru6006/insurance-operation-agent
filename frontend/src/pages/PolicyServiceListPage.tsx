import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { policyService, PolicyServiceRecord } from '../services/policyService'

export default function PolicyServiceListPage() {
  const [requests, setRequests] = useState<PolicyServiceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await policyService.listRequests(filter || undefined)
        setRequests(data)
      } catch (err) {
        console.error('Error fetching policy service requests:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchRequests()
  }, [filter])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Policy Servicing & Endorsements</h1>
          <p className="text-gray-400 text-sm mt-1">
            Automated customer servicing, three-tier autonomy governance, and instant policy mutations.
          </p>
        </div>
        <Link
          to="/policy-service/new"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow transition"
        >
          + New Service Request
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setFilter('')}
          className={`text-xs px-3 py-1.5 rounded-full border transition ${
            !filter ? 'bg-blue-600 border-blue-500 text-white' : 'border-gray-700 text-gray-400 hover:text-white'
          }`}
        >
          All Requests
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`text-xs px-3 py-1.5 rounded-full border transition ${
            filter === 'pending' ? 'bg-blue-600 border-blue-500 text-white' : 'border-gray-700 text-gray-400 hover:text-white'
          }`}
        >
          Pending Review
        </button>
        <button
          onClick={() => setFilter('resolved')}
          className={`text-xs px-3 py-1.5 rounded-full border transition ${
            filter === 'resolved' ? 'bg-blue-600 border-blue-500 text-white' : 'border-gray-700 text-gray-400 hover:text-white'
          }`}
        >
          Straight-Through Resolved
        </button>
      </div>

      {/* Requests Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading service queue...</div>
        ) : requests.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No service requests found.</div>
        ) : (
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-900/40 text-gray-400 text-xs font-semibold uppercase">
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Policy</th>
                <th className="py-3 px-4">Service Type</th>
                <th className="py-3 px-4">Summary</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/60">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-700/30 transition">
                  <td className="py-3.5 px-4 font-mono text-xs text-blue-400 font-semibold">{req.id}</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-gray-300">{req.policy_id}</td>
                  <td className="py-3.5 px-4 text-white font-medium capitalize">
                    {req.request_type.replace(/_/g, ' ')}
                  </td>
                  <td className="py-3.5 px-4 text-gray-300 truncate max-w-xs text-xs">
                    {req.description || 'Customer requested endorsement update'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        req.status === 'resolved'
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950/60 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to={`/policy-service/${req.id}`}
                      className="text-blue-400 hover:text-blue-300 text-xs font-semibold"
                    >
                      Resolve &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
