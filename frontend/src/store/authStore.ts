import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types/api'

interface AuthState {
  user: User | null
  token: string | null
  isEntraAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  setUser: (user: User) => void
  setEntraAuth: (user: User, token: string) => void
  logout: () => void
  clearToken: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isEntraAuthenticated: false,
      setAuth: (user, token) => {
        set({ user, token, isEntraAuthenticated: false })
      },
      setUser: (user) => {
        set({ user })
      },
      setEntraAuth: (user, token) => {
        set({ user, token, isEntraAuthenticated: true })
      },
      logout: () => {
        set({ user: null, token: null, isEntraAuthenticated: false })
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
  const { token, isEntraAuthenticated } = useAuthStore()
  return !!token && isEntraAuthenticated
}
