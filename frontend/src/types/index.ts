export interface User {
  id: string
  username: string
  email: string
  role: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
  login: (token: string, user: User) => void
  logout: () => void
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}
