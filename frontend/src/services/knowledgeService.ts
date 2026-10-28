import client from '../api/client'

export interface KnowledgeDocument {
  id: string
  title: string
  doc_type: string
  version: string
  created_at: string
}

export interface Citation {
  document_id: string
  document_title: string
  doc_type: string
  version: string
  chunk_index: number
  content: string
  relevance_score: number
}

export interface SearchResult {
  query: string
  citations: Citation[]
  summary_synthesis?: string
}

export const knowledgeService = {
  listDocuments: async (docType?: string): Promise<KnowledgeDocument[]> => {
    const url = docType ? `/knowledge/documents?doc_type=${docType}` : '/knowledge/documents'
    const res = await client.get(url)
    return res.data
  },

  search: async (query: string): Promise<SearchResult> => {
    const res = await client.post('/knowledge/search', { query })
    return res.data
  },

  createDocument: async (title: string, docType: string, content: string, version: string = '1.0') => {
    const res = await client.post('/knowledge/documents', {
      title,
      doc_type: docType,
      content,
      version
    })
    return res.data
  }
}
