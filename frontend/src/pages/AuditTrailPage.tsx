import React, { useEffect, useState } from 'react'
import { auditService, AuditEventRecord, AuditSummary } from '../services/auditService'

export default function AuditTrailPage() {
  const [events, setEvents] = useState<AuditEventRecord[]>([])
  const [summary, setSummary] = useState<AuditSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedEntity, setSelectedEntity] = useState<string>('')
  const [selectedActor, setSelectedActor] = useState<string>('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [selectedEntity, selectedActor])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [eventsData, summaryData] = await Promise.all([
        auditService.listEvents(selectedEntity || undefined, selectedActor || undefined),
        auditService.getSummary()
      ])
      setEvents(eventsData)
      setSummary(summaryData)
    } catch (err) {
      console.error('Failed to load audit records:', err)
    } finally {
      setLoading(false)
    }
  }

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(events, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `insureops_regulatory_audit_${Date.now()}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Audit Trail & Compliance Registry</h1>
          <p className="text-gray-400 text-sm mt-1">
            Immutable, cryptographically verifiable ledger of all autonomous AI actions, agent tool calls, and human approvals.
          </p>
        </div>
        <button
          onClick={exportJSON}
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded shadow flex items-center gap-2"
        >
          <span>Export Compliance Report</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
      </div>

      {/* Compliance Metrics Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
            <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total Recorded Events</div>
            <div className="text-3xl font-bold text-white mt-2 font-mono">{summary.total_events}</div>
            <div className="text-xs text-gray-500 mt-1">Across all active tenants</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
            <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Audit Integrity Score</div>
            <div className="text-3xl font-bold text-emerald-400 mt-2 font-mono">{summary.compliance_score}%</div>
            <div className="text-xs text-gray-500 mt-1">Zero unverified tampering</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
            <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">AI Agent Actions</div>
            <div className="text-3xl font-bold text-blue-400 mt-2 font-mono">{summary.by_actor.agent ?? 0}</div>
            <div className="text-xs text-gray-500 mt-1">Fully logged tool executions</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
            <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Regulatory Framework</div>
            <div className="text-sm font-semibold text-amber-300 mt-3">{summary.regulatory_framework}</div>
            <div className="text-xs text-gray-500 mt-1">State Department of Insurance ready</div>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Entity Filter</label>
          <select
            value={selectedEntity}
            onChange={(e) => setSelectedEntity(e.target.value)}
            className="bg-gray-700 text-white text-sm px-3 py-1.5 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Entities</option>
            <option value="submission">Submissions (Underwriting)</option>
            <option value="claim">Claims Adjudication</option>
            <option value="policy_service">Policy Servicing</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Actor Filter</label>
          <select
            value={selectedActor}
            onChange={(e) => setSelectedActor(e.target.value)}
            className="bg-gray-700 text-white text-sm px-3 py-1.5 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Actors</option>
            <option value="agent">Autonomous Agents</option>
            <option value="user">Human Operators / Adjusters</option>
            <option value="system">Core System Connectors</option>
          </select>
        </div>

        {(selectedEntity || selectedActor) && (
          <button
            onClick={() => { setSelectedEntity(''); setSelectedActor('') }}
            className="text-xs text-gray-400 hover:text-white underline mt-5"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Audit Log Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading audit events...</div>
        ) : events.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No audit records match the current criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-900/60 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-700">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Result</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/60">
                {events.map((ev) => {
                  const isExpanded = expandedId === ev.id
                  return (
                    <React.Fragment key={ev.id}>
                      <tr className="hover:bg-gray-700/30 transition">
                        <td className="py-3 px-4 font-mono text-xs text-gray-400">
                          {new Date(ev.created_at).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                              ev.actor_type === 'agent'
                                ? 'bg-purple-950 text-purple-300 border border-purple-800'
                                : ev.actor_type === 'user'
                                ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                : 'bg-gray-700 text-gray-300'
                            }`}
                          >
                            {ev.actor_type}: {ev.actor_id}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-white">{ev.action}</td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-gray-300 text-xs">{ev.entity_type}</span>{' '}
                          <span className="font-mono text-xs text-blue-400">({ev.entity_id})</span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-xs px-2 py-0.5 rounded uppercase font-semibold ${
                              ev.result === 'success'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-red-950 text-red-300 border border-red-800'
                            }`}
                          >
                            {ev.result}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : ev.id)}
                            className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
                          >
                            {isExpanded ? 'Hide Payload' : 'View Payload'}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-gray-900/80">
                          <td colSpan={6} className="py-3 px-4">
                            <div className="bg-gray-950 border border-gray-800 rounded p-3 text-xs font-mono text-gray-300 overflow-x-auto">
                              <div className="text-gray-500 mb-1">// Event ID: {ev.id} | Tenant: {ev.tenant_id}</div>
                              <pre>{JSON.stringify(ev.metadata_ || {}, null, 2)}</pre>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
