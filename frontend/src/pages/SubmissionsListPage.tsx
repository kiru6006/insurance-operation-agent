import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { submissionService } from '../services/submissionService'

export default function SubmissionsListPage() {
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const data = await submissionService.listSubmissions(filter || undefined)
        setSubmissions(data)
      } catch (err) {
        console.error('Error fetching submissions:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSubmissions()
  }, [filter])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Underwriting Submissions</h1>
          <p className="text-gray-400 text-sm mt-1">Review broker intake, document audits, and AI risk signals.</p>
        </div>
        <Link
          to="/submissions/new"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow transition"
        >
          + New Submission
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setFilter('')}
          className={`text-xs px-3 py-1.5 rounded-full border transition ${
            !filter ? 'bg-blue-600 border-blue-500 text-white' : 'border-gray-700 text-gray-400 hover:text-white'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('submitted')}
          className={`text-xs px-3 py-1.5 rounded-full border transition ${
            filter === 'submitted' ? 'bg-blue-600 border-blue-500 text-white' : 'border-gray-700 text-gray-400 hover:text-white'
          }`}
        >
          Intake Queue
        </button>
        <button
          onClick={() => setFilter('analyzed')}
          className={`text-xs px-3 py-1.5 rounded-full border transition ${
            filter === 'analyzed' ? 'bg-blue-600 border-blue-500 text-white' : 'border-gray-700 text-gray-400 hover:text-white'
          }`}
        >
          Analyzed
        </button>
      </div>

      {/* Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading submissions...</div>
        ) : submissions.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No submissions found.</div>
        ) : (
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-900/40 text-gray-400 text-xs font-semibold uppercase">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Applicant</th>
                <th className="py-3 px-4">Line of Business</th>
                <th className="py-3 px-4">Broker</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/60">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-700/30 transition">
                  <td className="py-3.5 px-4 font-mono text-xs text-blue-400 font-semibold">{sub.id}</td>
                  <td className="py-3.5 px-4 font-medium text-white">{sub.applicant_name}</td>
                  <td className="py-3.5 px-4 text-gray-300">{sub.line_of_business}</td>
                  <td className="py-3.5 px-4 text-gray-400 text-xs">{sub.broker_id}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        sub.status === 'analyzed'
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950/60 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to={`/submissions/${sub.id}`}
                      className="text-blue-400 hover:text-blue-300 text-xs font-semibold"
                    >
                      Open Dossier &rarr;
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
