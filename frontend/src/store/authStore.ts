import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types/api'

interface AuthState {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  setUser: (user: User) => void
  logout: () => void
  clearToken: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        set({ user, token })
      },
      setUser: (user) => {
        set({ user })
      },
      logout: () => {
        set({ user: null, token: null })
      },
      clearToken: () => {
        set({ token: null })
      },
    }),
    {
      name: 'auth-storage',
      storage: (() => {
        // Usar sessionStorage en lugar de localStorage para mayor seguridad
        return {
          getItem: (name: string) => {
            const item = sessionStorage.getItem(name)
            return item ? JSON.parse(item) : null
          },
          setItem: (name: string, value: any) => {
            sessionStorage.setItem(name, JSON.stringify(value))
          },
          removeItem: (name: string) => {
            sessionStorage.removeItem(name)
          },
        }
      })(),
    },
  ),
)

export const useIsAuthenticated = () => {
  const { token } = useAuthStore()
  return !!token
}
