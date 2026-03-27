import { api } from '@/lib/api'
import type { LoginResponse, RegisterRequest } from '@/lib/api.types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  name: string
  phone_number: string
}

interface Tokens {
  access_token: string
  refresh_token: string
}

interface AuthStore {
  user: User | null
  tokens: Tokens | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (phone_number: string, password: string) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  setTokens: (tokens: Tokens) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (phone_number: string, password: string) => {
        set({ isLoading: true })
        try {
          const response = await api.post<LoginResponse>('/auth/login', {
            phone_number,
            password,
          })

          const { user, tokens } = response

          set({
            user: {
              id: user.id,
              name: user.name,
              phone_number: user.phone_number,
            },
            tokens,
            isAuthenticated: true,
            isLoading: false,
          })

          // Store token in localStorage for API requests
          if (tokens?.access_token) {
            localStorage.setItem('access_token', tokens.access_token)
            localStorage.setItem('refresh_token', tokens.refresh_token || '')
          }
        } catch (error) {
          set({ isLoading: false })
          throw error instanceof Error ? error : new Error('Login failed')
        }
      },

      register: async (data: RegisterRequest) => {
        set({ isLoading: true })
        try {
          const response = await api.post<LoginResponse>('/auth/register', data)

          const { user, tokens } = response

          set({
            user: {
              id: user.id,
              name: user.name,
              phone_number: user.phone_number,
            },
            tokens,
            isAuthenticated: true,
            isLoading: false,
          })

          // Store token in localStorage for API requests
          if (tokens?.access_token) {
            localStorage.setItem('access_token', tokens.access_token)
            localStorage.setItem('refresh_token', tokens.refresh_token || '')
          }
        } catch (error) {
          set({ isLoading: false })
          throw error instanceof Error ? error : new Error('Registration failed')
        }
      },

      logout: () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
        })
      },

      setTokens: (tokens: Tokens) => {
        set({ tokens })
        if (tokens?.access_token) {
          localStorage.setItem('access_token', tokens.access_token)
          localStorage.setItem('refresh_token', tokens.refresh_token || '')
        }
      },
    }),
    {
      name: 'auth-store',
    },
  ),
)
