import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMsal } from '@azure/msal-react'
import { useEntraAuth } from '@/hooks/useEntraAuth'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Loader2 } from 'lucide-react'

export default function AuthPage() {
  const navigate = useNavigate()
  const { accounts } = useMsal()
  const { login, isLoading, error } = useEntraAuth()
  const isAuthenticated = useAuthStore((state) => !!state.token && state.isEntraAuthenticated)


  // Si ya está autenticado, redirige al dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  // Si ya tiene sesión en MSAL, intenta hacer login automático
  useEffect(() => {
    if (accounts.length > 0 && !isAuthenticated) {
      login()
    }
  }, [accounts.length, isAuthenticated, login])

  const handleLoginClick = () => {
    login()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-green-25 to-white px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br from-green-500 to-green-600 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
            Jelou
          </h1>
          <h2 className="text-2xl font-bold text-gray-900 mt-2">Project Manager</h2>
          <p className="mt-2 text-gray-600">Gestiona tus proyectos con confianza y seguridad</p>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-25 border-b border-green-200">
            <CardTitle className="text-green-700">Iniciar Sesión</CardTitle>
            <CardDescription>Usa tu cuenta de Microsoft Entra ID</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Login Button */}
            <div className="space-y-4">
              <Button
                onClick={handleLoginClick}
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0z" />
                    </svg>
                    Iniciar con Microsoft
                  </>
                )}
              </Button>

              {/* Info Text */}
              <p className="text-center text-sm text-gray-600 mt-4">
                Ingresa con tu cuenta corporativa de Microsoft Entra ID
              </p>

              {/* Features List */}
              <div className="space-y-2 mt-6 pt-6 border-t border-green-200">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-6 w-6 rounded-md bg-green-100">
                      <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">Autenticación segura con Azure Entra ID</p>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-6 w-6 rounded-md bg-green-100">
                      <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">Sin contraseñas que recordar</p>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-6 w-6 rounded-md bg-green-100">
                      <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">Tokens JWT seguros y renovables</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 space-y-2">
          <p>© 2025 Jelou. Todos los derechos reservados.</p>
          <p>Protegido con OAuth 2.0 + PKCE y Azure Entra ID</p>
        </div>
      </div>
    </div>
  )
}
