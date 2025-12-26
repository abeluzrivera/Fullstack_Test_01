import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useTasks } from '@/hooks/useTasks'

export default function MyTasksPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const { data: allTasks, isLoading } = useTasks()

  const myTasks = allTasks?.filter(
    (task) =>
      typeof task.assignedTo === 'object' &&
      task.assignedTo?._id === user?._id
  ) || []

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-700'
      case 'en progreso':
        return 'bg-blue-100 text-blue-700'
      case 'completada':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta':
        return 'bg-red-100 text-red-700'
      case 'media':
        return 'bg-yellow-100 text-yellow-700'
      case 'baja':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-green-600 hover:text-green-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Mis Tareas Asignadas</h1>
          <p className="text-gray-500 mt-1">
            Aquí están todas las tareas que tienes asignadas ({myTasks.length})
          </p>
        </div>
      </div>

      {/* Tasks List */}
      <div className="p-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-3 border-green-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : myTasks.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
            <p className="text-gray-500 text-lg">No tienes tareas asignadas</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myTasks.map((task) => (
              <div
                key={task._id}
                className={`bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow flex items-center justify-between ${
                  task.status === 'completada' ? 'opacity-60' : ''
                }`}
              >
                <div className="flex-1">
                  <h3
                    className={`font-semibold ${
                      task.status === 'completada'
                        ? 'line-through text-gray-500'
                        : 'text-gray-900'
                    }`}
                  >
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/projects/${task.project._id || task.project}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex-shrink-0 ml-4"
                >
                  <ExternalLink className="w-4 h-4" />
                  Ir al Proyecto
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
