import { LogOut, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'
import RecentProjects from '@/components/dashboard/RecentProjects'
import ActivityOverview from '@/components/dashboard/ActivityOverview'
import { useDashboardStats } from '@/hooks/useDashboard'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()
  const { data: stats, isLoading } = useDashboardStats()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const completionPercentage = stats?.tasks.total ? Math.round((stats?.tasks.byStatus.completada / stats?.tasks.total) * 100) : 0
  const inProgressCount = stats?.tasks.byStatus['en progreso'] || 0
  const pendingCount = stats?.tasks.byStatus.pendiente || 0

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pantalla Principal</h1>
            <p className="text-gray-500 mt-1">
              Aquí están todos tus proyectos y tareas en un vistazo
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold hover:bg-green-700 transition-colors">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium text-gray-900"> Hola, {user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-3 border-green-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Resumen de Tareas */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tu Progreso</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Gráfico Circular de Progreso */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex flex-col items-center">
                    <div className="relative w-32 h-32 mb-4">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                        <circle
                          cx="60"
                          cy="60"
                          r="54"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="8"
                          strokeDasharray={`${(completionPercentage / 100) * 339.3} 339.3`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold text-gray-900">{completionPercentage}%</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 text-center">Tareas Completadas</p>
                    <p className="text-xs text-gray-500 mt-1">{stats?.tasks.byStatus.completada || 0} de {stats?.tasks.total || 0}</p>
                  </div>
                </div>

                {/* Estado de Tareas */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-blue-500" />
                        <span className="text-sm text-gray-600">En Progreso</span>
                      </div>
                      <span className="text-2xl font-bold text-blue-600">{inProgressCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                        <span className="text-sm text-gray-600">Por Hacer</span>
                      </div>
                      <span className="text-2xl font-bold text-amber-600">{pendingCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-gray-600">Completadas</span>
                      </div>
                      <span className="text-2xl font-bold text-green-600">{stats?.tasks.byStatus.completada || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Resumen de Proyectos */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total de Proyectos</p>
                      <p className="text-3xl font-bold text-gray-900">{stats?.projects.total || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total de Tareas</p>
                      <p className="text-3xl font-bold text-gray-900">{stats?.tasks.total || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Asignadas a Ti</p>
                      <p className="text-3xl font-bold text-green-600">{stats?.tasks.assigned || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          

            {/* Secciones de Proyectos y Actividad */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Tus Proyectos</h2>
                <RecentProjects />
              </div>
              {stats?.recentTasks && stats.recentTasks.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Actividad Reciente</h2>
                  <ActivityOverview />
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
