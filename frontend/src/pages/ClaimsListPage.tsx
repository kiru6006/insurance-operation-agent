import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { claimsService, ClaimRecord } from '../services/claimsService'

export default function ClaimsListPage() {
  const [claims, setClaims] = useState<ClaimRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const data = await claimsService.listClaims(filter || undefined)
        setClaims(data)
      } catch (err) {
        console.error('Error fetching claims:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchClaims()
  }, [filter])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Claims Adjudication</h1>
          <p className="text-gray-400 text-sm mt-1">
            Automate FNOL intake, coverage limits verification, and AI-driven fraud anomaly detection.
          </p>
        </div>
        <Link
          to="/claims/new"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow transition"
        >
          + File New Claim
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
          All Claims
        </button>
        <button
          onClick={() => setFilter('reported')}
          className={`text-xs px-3 py-1.5 rounded-full border transition ${
            filter === 'reported' ? 'bg-blue-600 border-blue-500 text-white' : 'border-gray-700 text-gray-400 hover:text-white'
          }`}
        >
          Reported
        </button>
        <button
          onClick={() => setFilter('under_review')}
          className={`text-xs px-3 py-1.5 rounded-full border transition ${
            filter === 'under_review' ? 'bg-blue-600 border-blue-500 text-white' : 'border-gray-700 text-gray-400 hover:text-white'
          }`}
        >
          Under Review
        </button>
      </div>

      {/* Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading claims data...</div>
        ) : claims.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No claims found.</div>
        ) : (
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-900/40 text-gray-400 text-xs font-semibold uppercase">
                <th className="py-3 px-4">Claim ID</th>
                <th className="py-3 px-4">Policy ID</th>
                <th className="py-3 px-4">Claim Type</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/60">
              {claims.map((claim) => (
                <tr key={claim.id} className="hover:bg-gray-700/30 transition">
                  <td className="py-3.5 px-4 font-mono text-xs text-blue-400 font-semibold">{claim.id}</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-gray-300">{claim.policy_id}</td>
                  <td className="py-3.5 px-4 text-white font-medium capitalize">
                    {claim.claim_type ? claim.claim_type.replace(/_/g, ' ') : 'Property Damage'}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-white">
                    ${Number(claim.amount_claimed).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        claim.status === 'approved'
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                          : claim.status === 'investigation_required'
                          ? 'bg-rose-950/60 text-rose-300 border border-rose-800'
                          : 'bg-amber-950/60 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {claim.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to={`/claims/${claim.id}`}
                      className="text-blue-400 hover:text-blue-300 text-xs font-semibold"
                    >
                      Adjudicate &rarr;
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
