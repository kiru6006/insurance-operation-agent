import { create } from 'zustand'
import { User, AuthState } from '../types'

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
  login: (token: string, user: User) => {
    localStorage.setItem('token', token)
    set({ token, user, error: null })
  },
  logout: () => {
    localStorage.removeItem('token')
    set({ token: null, user: null })
  },
}))
