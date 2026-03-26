import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  name: string
  email: string
}

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

// Mock users for demo
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'jane@vitalis.io': {
    password: 'password123',
    user: {
      id: '1',
      name: 'Jane Doe',
      email: 'jane@vitalis.io',
    },
  },
  'john@vitalis.io': {
    password: 'password456',
    user: {
      id: '2',
      name: 'John Smith',
      email: 'john@vitalis.io',
    },
  },
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        const mockUser = MOCK_USERS[email]
        if (mockUser && mockUser.password === password) {
          set({
            user: mockUser.user,
            isAuthenticated: true,
            isLoading: false,
          })
        } else {
          set({ isLoading: false })
          throw new Error('Invalid credentials')
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: 'auth-store',
    }
  )
)
