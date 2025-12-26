import { useCallback, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/api/auth'

export function useAuth() {
  const { setAuth, logout: storeLogout } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await authApi.login({ email, password })
      setAuth(result.user, result.token)
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [setAuth])

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await authApi.register({ name, email, password })
      setAuth(result.user, result.token)
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [setAuth])

  const logout = useCallback(async () => {
    try {
      setIsLoading(true)
      await authApi.logout()
    } catch {
      // ignore
    } finally {
      storeLogout()
      setIsLoading(false)
    }
  }, [storeLogout])

  return {
    login,
    register,
    logout,
    isLoading,
    error,
  }
}
