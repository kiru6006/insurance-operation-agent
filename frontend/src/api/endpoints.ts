export const API_ENDPOINTS = {
  health: '/health',
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
  },
  workflows: {
    list: '/workflows',
    get: (id: string) => `/workflows/${id}`,
  },
} as const
