import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { submissionService } from '../services/submissionService'
import DocumentUpload from '../components/DocumentUpload'
import SubmissionTimeline from '../components/SubmissionTimeline'

export default function SubmissionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [submission, setSubmission] = useState<any>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)

  useEffect(() => {
    if (id) {
      fetchDetail(id)
    }
  }, [id])

  const fetchDetail = async (subId: string) => {
    try {
      const data = await submissionService.getSubmission(subId)
      setSubmission(data)
    } catch (err) {
      console.error('Error fetching detail:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (file: File, type: string) => {
    if (!id) return
    const newDoc = await submissionService.uploadDocument(id, file, type)
    setSubmission((prev: any) => ({
      ...prev,
      documents: [...(prev.documents || []), newDoc]
    }))
  }

  const handleRunAnalysis = async () => {
    if (!id) return
    setAnalyzing(true)
    try {
      const result = await submissionService.analyzeSubmission(id)
      setAnalysis(result.results)
      setSubmission((prev: any) => ({ ...prev, status: 'analyzed' }))
    } catch (err) {
      console.error('Analysis failed:', err)
    } finally {
      setAnalyzing(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Loading submission dossier...</div>
  }

  if (!submission) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Submission dossier not found.</p>
        <Link to="/submissions" className="text-blue-400 text-sm mt-3 inline-block">Back to submissions</Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs bg-gray-800 text-blue-400 px-2.5 py-1 rounded border border-gray-700">
              {submission.id}
            </span>
            <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
              {submission.line_of_business}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-1">{submission.applicant_name}</h1>
        </div>

        <button
          onClick={handleRunAnalysis}
          disabled={analyzing}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg shadow transition flex items-center gap-2"
        >
          {analyzing ? 'Agents Orchestrating...' : '⚡ Run Agent Workflow'}
        </button>
      </div>

      {/* Workflow Timeline */}
      <SubmissionTimeline
        status={submission.status}
        completenessScore={analysis?.completeness?.completeness_score}
      />

      {/* Dossier Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details & Documents */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800 border border-gray-700 p-5 rounded-lg space-y-4">
            <h2 className="text-white font-semibold text-base">Application & Broker Context</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block">Broker ID:</span>
                <span className="text-white font-medium">{submission.broker_id}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Target Effective Date:</span>
                <span className="text-white font-medium">2026-11-01</span>
              </div>
              <div>
                <span className="text-gray-400 block">Current Status:</span>
                <span className="text-emerald-400 font-medium capitalize">{submission.status}</span>
              </div>
            </div>
          </div>

          {/* Attached Documents */}
          <div className="bg-gray-800 border border-gray-700 p-5 rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-white font-semibold text-base">Indexed Submission Documents</h2>
              <span className="text-xs text-gray-400">{submission.documents?.length || 0} files</span>
            </div>

            <div className="divide-y divide-gray-700/60">
              {submission.documents?.map((doc: any) => (
                <div key={doc.id} className="py-2.5 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-white font-medium block">{doc.file_name}</span>
                    <span className="text-gray-400 uppercase text-[10px]">{doc.document_type}</span>
                  </div>
                  <span className="text-emerald-400 font-semibold text-[11px]">✓ Processed</span>
                </div>
              ))}
            </div>

            <DocumentUpload onUpload={handleUpload} />
          </div>
        </div>

        {/* Right Col: AI Agent Intelligence Dossier */}
        <div className="space-y-6">
          <div className="bg-gray-800 border border-gray-700 p-5 rounded-lg space-y-4">
            <h2 className="text-white font-semibold text-base flex items-center justify-between">
              <span>Agent Insights</span>
              <span className="text-xs bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded border border-blue-700">
                InsureOps Core
              </span>
            </h2>

            {analysis ? (
              <div className="space-y-4 text-xs">
                <div className="bg-gray-900/80 p-3 rounded border border-gray-700/60">
                  <div className="text-gray-400 font-semibold mb-1">Completeness Assessment</div>
                  <div className="text-white">{analysis.completeness.recommendation}</div>
                  {analysis.completeness.missing_documents.length > 0 && (
                    <div className="mt-2 text-amber-400">
                      Missing: {analysis.completeness.missing_documents.join(', ')}
                    </div>
                  )}
                </div>

                <div className="bg-gray-900/80 p-3 rounded border border-gray-700/60">
                  <div className="text-gray-400 font-semibold mb-1">Risk Severity</div>
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs uppercase font-bold mb-2 ${
                      analysis.risk_summary.overall_severity === 'high'
                        ? 'bg-red-900 text-red-200'
                        : 'bg-blue-900 text-blue-200'
                    }`}
                  >
                    {analysis.risk_summary.overall_severity} Risk
                  </span>
                  <div className="space-y-2">
                    {analysis.risk_summary.risk_factors.map((rf: any, i: number) => (
                      <div key={i} className="text-gray-300">
                        <span className="font-semibold text-white block">• {rf.factor}</span>
                        <span className="text-gray-400">{rf.evidence}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-900/80 p-3 rounded border border-gray-700/60">
                  <div className="text-gray-400 font-semibold mb-1">Underwriter Recommendation</div>
                  <div className="text-emerald-400 font-semibold uppercase">
                    {analysis.risk_summary.decision_recommendation.replace(/_/g, ' ')}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-xs leading-relaxed">
                Click <strong>"Run Agent Workflow"</strong> to execute submission intake, document completeness check, and risk factor synthesis.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
