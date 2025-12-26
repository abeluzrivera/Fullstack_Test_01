import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function AuthPage() {
  const navigate = useNavigate()
  const { login, register, isLoading } = useAuth()
  const isAuthenticated = useAuthStore((state) => !!state.token)
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard')
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (mode === 'login') {
        await login(email, password)
        toast.success('¡Bienvenido!')
      } else {
        await register(name, email, password)
        toast.success('¡Cuenta creada exitosamente!')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error'
      toast.error(message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-green-25 to-white px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br from-green-500 to-green-600 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">Jelou</h1>
          <h2 className="text-2xl font-bold text-gray-900 mt-2">Project Manager</h2>
          <p className="mt-2 text-gray-600">Gestiona tus proyectos con confianza y seguridad</p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-25 border-b border-green-200">
            <CardTitle className="text-green-700">{mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}</CardTitle>
            <CardDescription>{mode === 'login' ? 'Ingresa con tu correo y contraseña' : 'Regístrate para empezar'}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="text-sm text-gray-600 block mb-2">Nombre</label>
                  <input
                    required
                    placeholder="Tu nombre completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              )}

              <div>
                <label className="text-sm text-gray-600 block mb-2">Correo electrónico</label>
                <input
                  required
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-2">Contraseña</label>
                <input
                  required
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg"
              >
                {isLoading ? 'Procesando...' : mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
              </Button>

              <div className="text-center">
                <button 
                  type="button" 
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')} 
                  className="text-sm text-green-600 hover:text-green-700 underline"
                >
                  {mode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-gray-500 space-y-2">
          <p>© 2025 Jelou. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  )
}
