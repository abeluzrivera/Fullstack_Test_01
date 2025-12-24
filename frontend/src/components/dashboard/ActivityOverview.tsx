import { useDashboardStats } from '@/hooks/useDashboard'
import { Clock, CheckCircle2, AlertCircle, Circle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function ActivityOverview() {
  const { data: stats } = useDashboardStats()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completada':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case 'en progreso':
        return <AlertCircle className="w-5 h-5 text-orange-500" />
      case 'pendiente':
        return <Circle className="w-5 h-5 text-gray-400" />
      default:
        return <Circle className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completada':
        return 'Completed'
      case 'en progreso':
        return 'In Progress'
      case 'pendiente':
        return 'Pending'
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completada':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'en progreso':
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case 'pendiente':
        return 'bg-gray-50 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta':
        return 'text-red-600'
      case 'media':
        return 'text-yellow-600'
      case 'baja':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const recentTasks = stats?.recentTasks || []

  if (recentTasks.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
        <Clock className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {recentTasks.map((task) => (
          <div
            key={task._id}
            className="flex items-start space-x-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <div className="shrink-0 mt-0.5">{getStatusIcon(task.status)}</div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h4 className="text-sm font-semibold text-gray-900 truncate">
                  {task.title}
                </h4>
                <span
                  className={`ml-2 px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(task.status)} whitespace-nowrap`}
                >
                  {getStatusText(task.status)}
                </span>
              </div>

              {task.description && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                  {task.description}
                </p>
              )}

              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center">
                  <span className="font-medium text-gray-700">
                    {typeof task.project === 'string'
                      ? task.project
                      : task.project?.name || 'Unknown Project'}
                  </span>
                </span>

                <span
                  className={`font-medium ${getPriorityColor(task.priority)}`}
                >
                  {task.priority === 'alta'
                    ? 'High'
                    : task.priority === 'media'
                      ? 'Medium'
                      : 'Low'}{' '}
                  Priority
                </span>

                {task.assignedTo && (
                  <span>
                    Assigned to{' '}
                    <span className="font-medium text-gray-700">
                      {typeof task.assignedTo === 'string'
                        ? task.assignedTo
                        : task.assignedTo?.name || 'Unknown'}
                    </span>
                  </span>
                )}

                <span className="ml-auto">
                  {formatDistanceToNow(new Date(task.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
