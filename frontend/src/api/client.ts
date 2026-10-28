import axios from 'axios'
import { useAuthStore } from '../stores/authStore'
import { handleMockRequest } from '../services/mockStaticBackend'

const client = axios.create({
  baseURL: '/api/v1',
})

// Check if we are running in an environment without a backend (e.g. GitHub Pages or static mode)
const isStaticOrGithubPages =
  typeof window !== 'undefined' &&
  (window.location.hostname.includes('github.io') ||
   window.location.search.includes('mock=true') ||
   (import.meta as any).env?.VITE_MOCK_API === 'true')

client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // Intercept in client-side mock mode
  if (isStaticOrGithubPages) {
    const method = config.method || 'get'
    const url = config.url || ''
    const mockRes = handleMockRequest(method, url, config.data)
    if (mockRes) {
      config.adapter = async () => ({
        data: mockRes.data,
        status: mockRes.status,
        statusText: 'OK',
        headers: {},
        config,
      })
    }
  }

  return config
})

// Fallback response error handler: if the real backend returns 404/500/NetworkError (e.g., local preview or static host), transparently fallback to client-side mock
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If request failed because backend server is unreachable or returning 404/network error
    if (!error.response || error.code === 'ERR_NETWORK' || error.response.status === 404 || error.response.status >= 500) {
      const config = error.config
      if (config) {
        const method = config.method || 'get'
        const url = config.url || ''
        const mockRes = handleMockRequest(method, url, config.data)
        if (mockRes) {
          return {
            data: mockRes.data,
            status: mockRes.status,
            statusText: 'OK',
            headers: {},
            config,
          }
        }
      }
    }
    return Promise.reject(error)
  }
)

export default client
