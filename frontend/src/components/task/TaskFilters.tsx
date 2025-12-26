import { X } from 'lucide-react'
import type { Task } from '@/types/api'
import type { Project } from '@/types/api'
import { useMemo } from 'react'

interface TaskFiltersProps {
  filters: {
    status?: 'pendiente' | 'en progreso' | 'completada'
    priority?: 'baja' | 'media' | 'alta'
    project?: string
    assignedTo?: string
  }
  onFiltersChange: (filters: TaskFiltersProps['filters']) => void
  tasks: Task[]
  projects?: Project[]
}

export function TaskFilters({ filters, onFiltersChange, tasks, projects = [] }: TaskFiltersProps) {
  const handleStatusChange = (status: 'pendiente' | 'en progreso' | 'completada' | null) => {
    onFiltersChange({
      ...filters,
      status: status || undefined,
    })
  }

  const handlePriorityChange = (priority: 'baja' | 'media' | 'alta' | null) => {
    onFiltersChange({
      ...filters,
      priority: priority || undefined,
    })
  }

  const handleProjectChange = (projectId: string | null) => {
    onFiltersChange({
      ...filters,
      project: projectId || undefined,
    })
  }

  const handleAssignedToChange = (userId: string | null) => {
    onFiltersChange({
      ...filters,
      assignedTo: userId || undefined,
    })
  }

  const handleClearFilters = () => {
    onFiltersChange({})
  }

  const hasActiveFilters = filters.status || filters.priority || filters.project || filters.assignedTo

  // Obtener usuarios únicos asignados a tareas
  const assignedUsers = useMemo(() => {
    const users = new Map()
    tasks.forEach((task) => {
      if (task.assignedTo && typeof task.assignedTo === 'object') {
        users.set(task.assignedTo._id, task.assignedTo)
      }
    })
    return Array.from(users.values())
  }, [tasks])

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Estado:</label>
            <select
              value={filters.status || ''}
              onChange={(e) => handleStatusChange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Todos</option>
              <option value="pendiente">Por Hacer</option>
              <option value="en progreso">En Progreso</option>
              <option value="completada">Completada</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Prioridad:</label>
            <select
              value={filters.priority || ''}
              onChange={(e) => handlePriorityChange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Todas</option>
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </div>

          {/* Project Filter */}
          {projects.length > 0 && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Proyecto:</label>
              <select
                value={filters.project || ''}
                onChange={(e) => handleProjectChange(e.target.value || null)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Todos</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Assigned To Filter */}
          {assignedUsers.length > 0 && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Asignado a:</label>
              <select
                value={filters.assignedTo || ''}
                onChange={(e) => handleAssignedToChange(e.target.value || null)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Todos</option>
                {assignedUsers.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Stats and Clear Button */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {tasks.length} {tasks.length === 1 ? 'tarea' : 'tareas'}
          </span>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Limpiar filtros
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
