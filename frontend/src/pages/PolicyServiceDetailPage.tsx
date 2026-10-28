import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { policyService, PolicyServiceRecord } from '../services/policyService'

export default function PolicyServiceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [request, setRequest] = useState<PolicyServiceRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [resolving, setResolving] = useState(false)
  const [workflowResult, setWorkflowResult] = useState<any>(null)

  useEffect(() => {
    const fetchRequest = async () => {
      if (!id) return
      try {
        const data = await policyService.getRequest(id)
        setRequest(data)
      } catch (err) {
        console.error('Failed to load service request:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchRequest()
  }, [id])

  const handleProcess = async () => {
    if (!id) return
    setResolving(true)
    try {
      const res = await policyService.processRequest(id, { execute_update: true })
      setWorkflowResult(res.results)
      if (res.results && request) {
        setRequest({ ...request, status: res.results.status })
      }
    } catch (err) {
      console.error('Policy servicing failed:', err)
    } finally {
      setResolving(false)
    }
  }

  if (loading) {
    return <div className="text-gray-400 p-8 text-center text-sm">Loading service request...</div>
  }

  if (!request) {
    return (
      <div className="text-center p-12">
        <h2 className="text-xl font-bold text-white">Service request not found</h2>
        <Link to="/policy-service" className="text-blue-400 text-sm mt-3 inline-block">&larr; Return to Servicing Queue</Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Link to="/policy-service" className="text-gray-400 hover:text-white text-sm font-medium">&larr; Back</Link>
            <span className="text-gray-600">/</span>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-gray-800 text-blue-400 border border-gray-700">
              {request.id}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Service Request: {request.request_type.replace(/_/g, ' ')}
          </h1>
          <p className="text-gray-400 text-sm">
            Target Policy: <span className="font-mono text-blue-400">{request.policy_id}</span> (Customer: {request.customer_id})
          </p>
        </div>

        <button
          onClick={handleProcess}
          disabled={resolving || request.status === 'resolved'}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-sm px-5 py-2.5 rounded-lg shadow transition flex items-center gap-2"
        >
          {resolving ? 'Executing Agents...' : request.status === 'resolved' ? '✓ Resolved' : '⚡ Process Request'}
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Request Profile & Changes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 shadow space-y-4">
            <h2 className="text-base font-semibold text-white">Request Parameters & Proposed Changes</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-400 text-xs block">Request Type</span>
                <span className="text-white font-medium capitalize">
                  {request.request_type.replace(/_/g, ' ')}
                </span>
              </div>
              <div>
                <span className="text-gray-400 text-xs block">Status</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-900 border border-gray-700 text-gray-200">
                  {request.status}
                </span>
              </div>
              <div>
                <span className="text-gray-400 text-xs block">Created Date</span>
                <span className="text-white font-medium">
                  {new Date(request.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-gray-400 text-xs block mb-1">Customer Narrative</span>
              <p className="text-gray-200 text-sm bg-gray-900/60 p-3 rounded border border-gray-700/60 leading-relaxed">
                {request.description || 'Customer submitted request via portal.'}
              </p>
            </div>

            {request.requested_changes && (
              <div className="pt-2">
                <span className="text-gray-400 text-xs block mb-1">Requested Mutation Payload</span>
                <pre className="text-xs font-mono text-emerald-400 bg-gray-900 p-3 rounded border border-gray-700 whitespace-pre-wrap">
                  {typeof request.requested_changes === 'string'
                    ? request.requested_changes
                    : JSON.stringify(request.requested_changes, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Current Policy State */}
          {request.policy_details && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 shadow space-y-3">
              <h2 className="text-base font-semibold text-white">Active Policy Administration Record</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-400 text-xs block">Insured Name</span>
                  <span className="text-white font-medium">{request.policy_details.customer_name}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-xs block">Policy Limit</span>
                  <span className="text-white font-medium">${request.policy_details.limit?.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-xs block">Current Address</span>
                  <span className="text-gray-300 truncate block">{request.policy_details.address}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Autonomy & Execution Outcome */}
        <div className="space-y-6">
          {workflowResult ? (
            <div className="bg-gray-800 border border-emerald-500/40 rounded-lg p-5 shadow space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-white">Resolution Outcome</h3>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-700">
                  {workflowResult.status}
                </span>
              </div>

              {/* Autonomy Level Card */}
              <div className="bg-gray-900 p-3.5 rounded border border-gray-700 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Autonomy Tier</span>
                  <span className="text-blue-400 font-bold font-mono">
                    {workflowResult.autonomy_level}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Human Approval</span>
                  <span className={workflowResult.requires_human_approval ? 'text-amber-400 font-semibold' : 'text-emerald-400'}>
                    {workflowResult.requires_human_approval ? 'Required (Escalated)' : 'Straight-Through (Level 3)'}
                  </span>
                </div>
              </div>

              <div className="border border-gray-700 bg-gray-900/60 p-3.5 rounded text-xs space-y-1">
                <div className="text-gray-400 font-semibold">Confirmation</div>
                <div className="text-gray-200">
                  {workflowResult.execution_outcome?.confirmation_message}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow text-center space-y-3">
              <div className="w-12 h-12 bg-blue-900/40 border border-blue-500/40 rounded-full flex items-center justify-center mx-auto text-blue-400 text-xl font-bold">
                ⚙️
              </div>
              <h3 className="text-base font-semibold text-white">Pending Execution</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Run policy service agent pipeline to verify standing, evaluate three-tier autonomy governance, and apply direct policy updates.
              </p>
              <button
                onClick={handleProcess}
                disabled={resolving || request.status === 'resolved'}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2 rounded shadow transition"
              >
                Resolve Request
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
