import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { claimsService } from '../services/claimsService'

export default function CreateClaimPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    policy_id: 'POL-001',
    customer_id: 'CUST-001',
    incident_date: new Date().toISOString().split('T')[0],
    amount_claimed: 5000,
    claim_type: 'property_damage',
    description: '',
    incident_location: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await claimsService.createClaim({
        ...formData,
        incident_date: new Date(formData.incident_date).toISOString(),
        amount_claimed: Number(formData.amount_claimed)
      })
      navigate(`/claims/${res.id}`)
    } catch (err) {
      console.error('Failed to create claim:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Link to="/claims" className="text-gray-400 hover:text-white text-sm font-medium">&larr; Back to Claims</Link>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow">
        <h1 className="text-2xl font-bold text-white tracking-tight mb-1">File First Notice of Loss (FNOL)</h1>
        <p className="text-gray-400 text-sm mb-6">
          Submit claim details for real-time coverage validation and automated agent adjudication.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Policy ID</label>
              <input
                type="text"
                required
                value={formData.policy_id}
                onChange={(e) => setFormData({ ...formData, policy_id: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Customer / Insured ID</label>
              <input
                type="text"
                required
                value={formData.customer_id}
                onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Claim Type</label>
              <select
                value={formData.claim_type}
                onChange={(e) => setFormData({ ...formData, claim_type: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="property_damage">Property Damage</option>
                <option value="auto_collision">Commercial Auto Collision</option>
                <option value="water_damage">Water Loss / Pipe Burst</option>
                <option value="slip_and_fall">General Liability Slip & Fall</option>
                <option value="fire_damage">Commercial Fire Incident</option>
                <option value="equipment_breakdown">Machinery / Equipment Breakdown</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Incident Date</label>
              <input
                type="date"
                required
                value={formData.incident_date}
                onChange={(e) => setFormData({ ...formData, incident_date: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Claimed Amount ($)</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.amount_claimed}
                onChange={(e) => setFormData({ ...formData, amount_claimed: parseFloat(e.target.value) || 0 })}
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Incident Location</label>
              <input
                type="text"
                placeholder="e.g. 100 Main St, Chicago, IL"
                value={formData.incident_location}
                onChange={(e) => setFormData({ ...formData, incident_location: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Loss Narrative / Description</label>
            <textarea
              rows={4}
              placeholder="Describe what occurred, initial damage assessment, and repair estimates..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded shadow transition disabled:opacity-50"
            >
              {loading ? 'Filing FNOL...' : 'Submit Claim Dossier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
