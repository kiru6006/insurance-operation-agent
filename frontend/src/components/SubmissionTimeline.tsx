import React from 'react'

interface SubmissionTimelineProps {
  status: string
  currentStep?: string
  completenessScore?: number
}

export default function SubmissionTimeline({ status, currentStep, completenessScore }: SubmissionTimelineProps) {
  const steps = [
    { id: 'submitted', label: 'Submission Intake', desc: 'Email parsed & entities extracted' },
    { id: 'evaluating', label: 'Agent Validation', desc: 'Completeness check & document audit' },
    { id: 'risk_summary', label: 'Risk Intelligence', desc: 'Loss exposure analysis & underwriting signals' },
    { id: 'decision', label: 'Decision Preparation', desc: 'Human-in-the-loop review & binding recommendation' }
  ]

  return (
    <div className="bg-gray-800 border border-gray-700 p-5 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white text-sm font-semibold">Workflow Orchestration Pipeline</h3>
        {completenessScore !== undefined && (
          <span className="text-xs bg-blue-900/60 text-blue-300 border border-blue-700 px-2.5 py-1 rounded">
            Completeness: {Math.round(completenessScore * 100)}%
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {steps.map((s, idx) => {
          const isDone = status === 'completed' || idx === 0
          return (
            <div
              key={s.id}
              className={`p-3 rounded border ${
                isDone
                  ? 'border-emerald-600/60 bg-emerald-950/20 text-emerald-300'
                  : 'border-gray-700 bg-gray-900/60 text-gray-400'
              }`}
            >
              <div className="text-xs font-bold uppercase tracking-wider mb-1">
                Step {idx + 1}: {s.label}
              </div>
              <div className="text-xs opacity-80">{s.desc}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
