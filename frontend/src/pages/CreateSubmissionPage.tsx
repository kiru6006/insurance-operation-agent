import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { submissionService } from '../services/submissionService'

export default function CreateSubmissionPage() {
  const navigate = useNavigate()
  const [applicantName, setApplicantName] = useState('')
  const [brokerId, setBrokerId] = useState('BRK-001')
  const [lineOfBusiness, setLineOfBusiness] = useState('COMMERCIAL_PROPERTY')
  const [emailText, setEmailText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const res = await submissionService.createSubmission({
        broker_id: brokerId,
        applicant_name: applicantName,
        line_of_business: lineOfBusiness,
        initial_email_text: emailText
      })
      navigate(`/submissions/${res.id}`)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create submission')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Create Underwriting Submission</h1>
        <p className="text-gray-400 text-sm mt-1">Manual intake entry or broker email paste.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 p-6 rounded-lg space-y-5 shadow">
        {error && <div className="bg-red-900/60 border border-red-700 text-red-200 text-xs p-3 rounded">{error}</div>}

        <div>
          <label className="block text-gray-300 text-xs font-semibold uppercase mb-1.5">Applicant / Business Name</label>
          <input
            type="text"
            required
            value={applicantName}
            onChange={(e) => setApplicantName(e.target.value)}
            placeholder="e.g. Apex Logistics Corp"
            className="w-full bg-gray-700 text-white text-sm px-4 py-2.5 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-xs font-semibold uppercase mb-1.5">Broker Code</label>
            <input
              type="text"
              required
              value={brokerId}
              onChange={(e) => setBrokerId(e.target.value)}
              className="w-full bg-gray-700 text-white text-sm px-4 py-2.5 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-xs font-semibold uppercase mb-1.5">Line of Business</label>
            <select
              value={lineOfBusiness}
              onChange={(e) => setLineOfBusiness(e.target.value)}
              className="w-full bg-gray-700 text-white text-sm px-4 py-2.5 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            >
              <option value="COMMERCIAL_PROPERTY">Commercial Property</option>
              <option value="GENERAL_LIABILITY">General Liability</option>
              <option value="WORKERS_COMP">Workers Compensation</option>
              <option value="CYBER_SECURITY">Cyber Security</option>
              <option value="COMMERCIAL_AUTO">Commercial Auto</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-300 text-xs font-semibold uppercase mb-1.5">Broker Submission Email / Inbound Body</label>
          <textarea
            rows={5}
            value={emailText}
            onChange={(e) => setEmailText(e.target.value)}
            placeholder="Paste raw email from broker with policy limits, company size, and coverage details..."
            className="w-full bg-gray-700 text-white text-sm px-4 py-2.5 rounded border border-gray-600 focus:outline-none focus:border-blue-500 font-mono text-xs"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/submissions')}
            className="px-4 py-2 rounded text-xs font-medium text-gray-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white text-xs font-semibold px-5 py-2.5 rounded transition"
          >
            {isSubmitting ? 'Registering...' : 'Save & Proceed to Intake'}
          </button>
        </div>
      </form>
    </div>
  )
}
