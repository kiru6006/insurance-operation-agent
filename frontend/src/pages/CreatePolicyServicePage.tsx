import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { policyService } from '../services/policyService'

export default function CreatePolicyServicePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    policy_id: 'POL-001',
    customer_id: 'CUST-001',
    request_type: 'address_change',
    description: '',
    change_value: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      let changes: Record<string, any> = {}
      if (formData.request_type === 'address_change') {
        changes = { new_address: formData.change_value }
      } else if (formData.request_type === 'contact_change') {
        changes = { contact_email: formData.change_value }
      } else if (formData.request_type === 'vehicle_addition') {
        changes = { vehicle: formData.change_value }
      } else {
        changes = { notes: formData.change_value }
      }

      const res = await policyService.createRequest({
        policy_id: formData.policy_id,
        customer_id: formData.customer_id,
        request_type: formData.request_type,
        description: formData.description,
        requested_changes: changes
      })
      navigate(`/policy-service/${res.id}`)
    } catch (err) {
      console.error('Failed to create service request:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Link to="/policy-service" className="text-gray-400 hover:text-white text-sm font-medium">&larr; Back to Servicing Queue</Link>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow">
        <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Create Policy Service Request</h1>
        <p className="text-gray-400 text-sm mb-6">
          Submit customer servicing request for automated three-tier governance and endorsement execution.
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
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Customer ID</label>
              <input
                type="text"
                required
                value={formData.customer_id}
                onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Service Type</label>
            <select
              value={formData.request_type}
              onChange={(e) => setFormData({ ...formData, request_type: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="address_change">Premises Address Change (Level 3 Straight-Through)</option>
              <option value="contact_change">Primary Contact Email Update (Level 3 Straight-Through)</option>
              <option value="certificate_request">Certificate of Insurance (COI) Issue (Level 3 Straight-Through)</option>
              <option value="vehicle_addition">Vehicle Schedule Addition (Level 2 Recommend)</option>
              <option value="endorsement">Coverage Rider Endorsement (Level 1 Underwriter Sign-off)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
              {formData.request_type === 'address_change' ? 'New Premises Address' :
               formData.request_type === 'contact_change' ? 'New Contact Email' :
               formData.request_type === 'vehicle_addition' ? 'Vehicle Make/Model/Year/VIN' :
               'Requested Change Specification'}
            </label>
            <input
              type="text"
              required
              placeholder="Enter updated value..."
              value={formData.change_value}
              onChange={(e) => setFormData({ ...formData, change_value: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Customer Narrative & Context</label>
            <textarea
              rows={3}
              placeholder="Describe background context of the requested policy servicing action..."
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
              {loading ? 'Submitting Service Request...' : 'Submit Servicing Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
