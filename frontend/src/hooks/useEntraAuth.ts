import { useCallback, useEffect, useState } from 'react'
import { useMsal } from '@azure/msal-react'
import { apiScopes, extractUserInfoFromIdToken } from '@/lib/msalConfig'
import { useAuthStore } from '@/store/authStore'
import { apiClient } from '@/api/client'

/**
 * Hook para manejar autenticación con Azure Entra ID
 * Integra MSAL con la BD local mediante tokens JWT
 */
export function useEntraAuth() {
  const { instance, accounts } = useMsal()
  const { setEntraAuth, logout: storeLogout } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Inicia sesión con Entra ID
   */
  const login = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await instance.loginPopup({
        scopes: apiScopes,
        prompt: 'select_account',
      })

      if (response.accessToken) {
        // Extraer información del token
        const userInfo = extractUserInfoFromIdToken(response.idToken)

        // Guardar token en el store
        setEntraAuth(
          {
            _id: userInfo.oid || '',
            name: userInfo.name || userInfo.givenName || '',
            email: userInfo.email || '',
            createdAt: new Date().toISOString(),
          },
          response.accessToken,
        )

        // Sincronizar con backend (auto-crea usuario si no existe)
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.accessToken}`

        // Validar token en el backend
        await apiClient.post('/auth/entra/validate-token')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed'
      setError(errorMessage)
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [instance, setEntraAuth])

  /**
   * Obtiene un token de acceso válido
   * Si está cerca de expirar, lo renueva automáticamente
   */
  const acquireTokenSilently = useCallback(async (): Promise<string | null> => {
    try {
      const response = await instance.acquireTokenSilent({
        scopes: apiScopes,
        account: accounts[0],
      })

      if (response.accessToken) {
        // Actualizar header de autorización
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.accessToken}`
        return response.accessToken
      }
    } catch (err) {
      console.error('Error acquiring token silently:', err)
      // Si falla, intentar con popup
      try {
        const popupResponse = await instance.acquireTokenPopup({
          scopes: apiScopes,
          account: accounts[0],
        })

        if (popupResponse.accessToken) {
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${popupResponse.accessToken}`
          return popupResponse.accessToken
        }
      } catch {
        console.error('Failed to acquire token with popup')
      }
    }

    return null
  }, [instance, accounts])

  /**
   * Cierra sesión
   */
  const logout = useCallback(async () => {
    try {
      setIsLoading(true)

      // Notificar al backend
      try {
        await apiClient.post('/auth/entra/logout')
      } catch {
        console.warn('Failed to notify backend of logout')
      }

      // Limpiar store
      storeLogout()

      // Limpiar headers
      delete apiClient.defaults.headers.common['Authorization']

      // Logout de MSAL
      await instance.logoutPopup({
        postLogoutRedirectUri: '/',
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed'
      setError(errorMessage)
      console.error('Logout error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [instance, storeLogout])

  /**
   * Valida si el token actual es válido
   */
  const validateToken = useCallback(async (): Promise<boolean> => {
    try {
      const response = await apiClient.post('/auth/entra/validate-token')
      return response.status === 200
    } catch {
      return false
    }
  }, [])

  /**
   * Inicializar autenticación si hay sesión previa
   */
  useEffect(() => {
    if (accounts.length > 0) {
      acquireTokenSilently()
    }
  }, [accounts, acquireTokenSilently])

  return {
    login,
    logout,
    acquireTokenSilently,
    validateToken,
    isLoading,
    error,
  }
}
