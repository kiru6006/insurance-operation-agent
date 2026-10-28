import React, { useEffect, useState } from 'react'
import { knowledgeService, KnowledgeDocument, Citation } from '../services/knowledgeService'

export default function KnowledgePage() {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([])
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [citations, setCitations] = useState<Citation[]>([])
  const [synthesis, setSynthesis] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const data = await knowledgeService.listDocuments()
        setDocuments(data)
      } catch (err) {
        console.error('Failed to load knowledge documents:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDocs()
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setSearching(true)
    try {
      const res = await knowledgeService.search(query)
      setCitations(res.citations)
      setSynthesis(res.summary_synthesis || null)
    } catch (err) {
      console.error('Search failed:', err)
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Enterprise Knowledge & RAG</h1>
        <p className="text-gray-400 text-sm mt-1">
          Grounding insurance decisions in audited policy wordings, underwriting rules, and claims operating procedures.
        </p>
      </div>

      {/* Semantic Search Bar */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 shadow">
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            placeholder="Search guidelines (e.g. fire suppression requirements, ELD truck telematics, straight-through limit)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-gray-900 border border-gray-700 rounded px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={searching}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-2.5 rounded shadow transition disabled:opacity-50"
          >
            {searching ? 'Retrieving...' : 'Search RAG'}
          </button>
        </form>
      </div>

      {/* Synthesis Answer */}
      {synthesis && (
        <div className="bg-gray-800 border border-emerald-500/40 rounded-lg p-5 shadow space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">AI Grounded Synthesis</span>
          </div>
          <p className="text-sm text-gray-200 leading-relaxed bg-gray-900/60 p-3.5 rounded border border-gray-700/60">
            {synthesis}
          </p>
        </div>
      )}

      {/* Citations Grid */}
      {citations.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-white">Retrieved Evidence & Policy Citations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {citations.map((c, i) => (
              <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-white">{c.document_title}</h3>
                    <span className="text-xs text-blue-400 font-mono">v{c.version} • Chunk #{c.chunk_index + 1}</span>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-gray-900 text-emerald-400 border border-gray-700">
                    {(c.relevance_score * 100).toFixed(0)}% match
                  </span>
                </div>
                <p className="text-xs text-gray-300 bg-gray-900/50 p-2.5 rounded border border-gray-700/50 leading-relaxed">
                  {c.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Seeded Documents Repository */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow">
        <div className="p-4 border-b border-gray-700 bg-gray-900/40">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Indexed Guidelines & Forms</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading knowledge base...</div>
        ) : (
          <div className="divide-y divide-gray-700">
            {documents.map((doc) => (
              <div key={doc.id} className="p-4 hover:bg-gray-700/30 flex justify-between items-center transition">
                <div>
                  <div className="font-medium text-white text-sm">{doc.title}</div>
                  <div className="text-xs text-gray-400 capitalize">{doc.doc_type.replace(/_/g, ' ')} • Version {doc.version}</div>
                </div>
                <span className="text-xs text-emerald-400 font-mono">Audited & Active</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
