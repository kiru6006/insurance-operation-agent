import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { claimsService, ClaimRecord } from '../services/claimsService'

export default function ClaimDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [claim, setClaim] = useState<ClaimRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [adjudicating, setAdjudicating] = useState(false)
  const [adjudicationResult, setAdjudicationResult] = useState<any>(null)

  useEffect(() => {
    const fetchClaim = async () => {
      if (!id) return
      try {
        const data = await claimsService.getClaim(id)
        setClaim(data)
      } catch (err) {
        console.error('Failed to load claim:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchClaim()
  }, [id])

  const handleAdjudicate = async () => {
    if (!id) return
    setAdjudicating(true)
    try {
      const res = await claimsService.adjudicateClaim(id, { run_fraud_check: true })
      setAdjudicationResult(res.results)
      if (res.results && claim) {
        setClaim({ ...claim, status: res.results.status })
      }
    } catch (err) {
      console.error('Adjudication failed:', err)
    } finally {
      setAdjudicating(false)
    }
  }

  if (loading) {
    return <div className="text-gray-400 p-8 text-center text-sm">Loading claim records...</div>
  }

  if (!claim) {
    return (
      <div className="text-center p-12">
        <h2 className="text-xl font-bold text-white">Claim not found</h2>
        <Link to="/claims" className="text-blue-400 text-sm mt-3 inline-block">&larr; Return to Claims List</Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Link to="/claims" className="text-gray-400 hover:text-white text-sm font-medium">&larr; Back</Link>
            <span className="text-gray-600">/</span>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-gray-800 text-blue-400 border border-gray-700">
              {claim.id}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Claim Dossier: {claim.policy_id}
          </h1>
          <p className="text-gray-400 text-sm">
            Reported incident at {claim.incident_location || 'Insured Property'}
          </p>
        </div>

        <button
          onClick={handleAdjudicate}
          disabled={adjudicating}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-sm px-5 py-2.5 rounded-lg shadow transition flex items-center gap-2"
        >
          {adjudicating ? 'Agents Adjudicating...' : '⚡ Run AI Adjudication'}
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Claim Details & FNOL */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 shadow space-y-4">
            <h2 className="text-base font-semibold text-white">Incident & Coverage Profile</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-400 text-xs block">Claim Type</span>
                <span className="text-white font-medium capitalize">
                  {claim.claim_type ? claim.claim_type.replace(/_/g, ' ') : 'Property Damage'}
                </span>
              </div>
              <div>
                <span className="text-gray-400 text-xs block">Amount Claimed</span>
                <span className="text-white font-medium">
                  ${Number(claim.amount_claimed).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div>
                <span className="text-gray-400 text-xs block">Incident Date</span>
                <span className="text-white font-medium">
                  {new Date(claim.incident_date).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-gray-400 text-xs block">Policy Ref</span>
                <span className="text-blue-400 font-mono font-medium">{claim.policy_id}</span>
              </div>
              <div>
                <span className="text-gray-400 text-xs block">Current Status</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-900 border border-gray-700 text-gray-200">
                  {claim.status}
                </span>
              </div>
              <div>
                <span className="text-gray-400 text-xs block">Location</span>
                <span className="text-gray-300 truncate block">{claim.incident_location || 'N/A'}</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-gray-400 text-xs block mb-1">Loss Description</span>
              <p className="text-gray-200 text-sm bg-gray-900/60 p-3 rounded border border-gray-700/60 leading-relaxed">
                {claim.description || 'No detailed incident summary logged.'}
              </p>
            </div>
          </div>

          {/* FNOL Email Transcript */}
          {claim.fnol_email && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 shadow space-y-3">
              <h2 className="text-base font-semibold text-white">FNOL Ingestion Transcript</h2>
              <pre className="text-xs font-mono text-gray-300 bg-gray-900 p-3.5 rounded border border-gray-700 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                {claim.fnol_email}
              </pre>
            </div>
          )}

          {/* Documents Attached */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 shadow space-y-3">
            <h2 className="text-base font-semibold text-white">Attached Evidence & Documents</h2>
            {claim.documents && claim.documents.length > 0 ? (
              <div className="divide-y divide-gray-700 border border-gray-700 rounded-lg overflow-hidden text-sm">
                {claim.documents.map((doc) => (
                  <div key={doc.id} className="p-3 bg-gray-900/40 flex justify-between items-center hover:bg-gray-900/70 transition">
                    <div>
                      <div className="font-medium text-white">{doc.file_name}</div>
                      <div className="text-xs text-gray-400 capitalize">{doc.document_type.replace(/_/g, ' ')}</div>
                    </div>
                    <span className="text-xs text-blue-400 font-mono">Verified Artifact</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No initial artifacts uploaded.</p>
            )}
          </div>
        </div>

        {/* Right Column: AI Adjudication & Fraud Signals */}
        <div className="space-y-6">
          {adjudicationResult ? (
            <div className="bg-gray-800 border border-emerald-500/40 rounded-lg p-5 shadow space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-white">Adjudication Outcome</h3>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-700">
                  {adjudicationResult.decision}
                </span>
              </div>

              <div className="bg-gray-900 p-3.5 rounded border border-gray-700 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Approved Payout</span>
                  <span className="text-emerald-400 font-bold">
                    ${Number(adjudicationResult.approved_payout_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Human Approval Needed</span>
                  <span className={adjudicationResult.requires_human_approval ? 'text-amber-400 font-semibold' : 'text-gray-400'}>
                    {adjudicationResult.requires_human_approval ? 'Yes (Queue Pushed)' : 'No (Fast-Tracked)'}
                  </span>
                </div>
              </div>

              {/* Fraud Assessment Card */}
              <div className="border border-gray-700 bg-gray-900/60 p-3.5 rounded space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-semibold">Fraud Risk Score</span>
                  <span className="font-bold text-white">
                    {(adjudicationResult.fraud_assessment?.fraud_score * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      adjudicationResult.fraud_assessment?.risk_tier === 'HIGH'
                        ? 'bg-rose-500'
                        : adjudicationResult.fraud_assessment?.risk_tier === 'MEDIUM'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, (adjudicationResult.fraud_assessment?.fraud_score || 0.1) * 100)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400 pt-1">
                  Tier: <span className="text-white font-semibold">{adjudicationResult.fraud_assessment?.risk_tier}</span> ({adjudicationResult.fraud_assessment?.recommendation})
                </div>
              </div>

              {/* Signals List */}
              {adjudicationResult.fraud_assessment?.signals?.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">Detected Anomaly Signals</span>
                  {adjudicationResult.fraud_assessment.signals.map((sig: any, idx: number) => (
                    <div key={idx} className="p-2.5 rounded bg-rose-950/40 border border-rose-800 text-xs space-y-1">
                      <div className="font-bold text-rose-300">{sig.signal_type}</div>
                      <div className="text-gray-300">{sig.evidence}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow text-center space-y-3">
              <div className="w-12 h-12 bg-blue-900/40 border border-blue-500/40 rounded-full flex items-center justify-center mx-auto text-blue-400 text-xl font-bold">
                ⚡
              </div>
              <h3 className="text-base font-semibold text-white">Pending Adjudication</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Execute the tri-agent adjudication pipeline to trigger FNOL extraction, coverage constraint verification, and fraud scoring.
              </p>
              <button
                onClick={handleAdjudicate}
                disabled={adjudicating}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2 rounded shadow transition"
              >
                Start Evaluation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
