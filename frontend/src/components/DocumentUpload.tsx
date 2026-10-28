import React, { useState } from 'react'

interface DocumentUploadProps {
  onUpload: (file: File, type: string) => void
  disabled?: boolean
}

export default function DocumentUpload({ onUpload, disabled }: DocumentUploadProps) {
  const [docType, setDocType] = useState('application')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedFile) {
      onUpload(selectedFile, docType)
      setSelectedFile(null)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 p-4 rounded-lg space-y-4">
      <h3 className="text-white font-medium text-sm">Upload Submission Document</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-400 text-xs mb-1">Document Category</label>
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="w-full bg-gray-700 text-white text-sm px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
          >
            <option value="application">ACORD Application (ACORD 125/126)</option>
            <option value="loss_runs">5-Year Loss Runs Statement</option>
            <option value="soval">Statement of Values (SOV)</option>
            <option value="financials">Financials & Balance Sheet</option>
            <option value="cyber_questionnaire">Cyber Risk Questionnaire</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-400 text-xs mb-1">Select File (.pdf, .csv, .docx)</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full text-gray-300 text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={!selectedFile || disabled}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white text-xs font-semibold px-4 py-2 rounded transition duration-150"
      >
        Upload & Index Document
      </button>
    </form>
  )
}
