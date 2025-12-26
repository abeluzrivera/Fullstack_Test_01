import { CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import type { Task, Project } from '@/types/api'
import { TaskCard } from './TaskCard'
import { useState } from 'react'
import { useReorderTask } from '@/hooks/useTasks'
import { toast } from 'sonner'

interface KanbanBoardProps {
  tasksByStatus: {
    pendiente: Task[]
    'en progreso': Task[]
    completada: Task[]
  }
  onDragStart: (task: Task) => void
  onDropOnColumn: (status: string) => Promise<void>
  draggedTask: Task | null
  project: Project
}

export function KanbanBoard({
  tasksByStatus,
  onDragStart,
  onDropOnColumn,
  draggedTask,
  project,
}: KanbanBoardProps) {
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
  const [isDropping, setIsDropping] = useState(false)
  const reorderTask = useReorderTask()

  const columns = [
    {
      id: 'pendiente',
      title: 'Por Hacer',
      icon: AlertCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      tasks: tasksByStatus.pendiente,
    },
    {
      id: 'en progreso',
      title: 'En Progreso',
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      tasks: tasksByStatus['en progreso'],
    },
    {
      id: 'completada',
      title: 'Completada',
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      tasks: tasksByStatus.completada,
    },
  ]

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOverColumn(columnId)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    // Solo remover el highlight si salimos del área del drop
    if (e.currentTarget === e.target) {
      setDragOverColumn(null)
    }
  }

  const handleDrop = async (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOverColumn(null)
    setIsDropping(true)

    try {
      if (draggedTask) {
        // Calcular la posición en la que se dejó la tarea
        const droppedTasks = tasksByStatus[columnId as keyof typeof tasksByStatus] || []
        const newOrder = droppedTasks.length

        // Llamar al reordenamiento
        await reorderTask.mutateAsync({
          id: draggedTask._id,
          status: columnId,
          order: newOrder,
        })

        toast.success('Tarea reordenada')
      }
      await onDropOnColumn(columnId)
    } catch (error) {
      toast.error('Error al reordenar la tarea')
      console.error('Failed to reorder task:', error)
    } finally {
      setIsDropping(false)
    }
  }

  // Función para ordenar tareas por prioridad (alta primero)
  const sortTasksByPriority = (tasks: Task[]) => {
    const priorityOrder = { alta: 0, media: 1, baja: 2 }
    return [...tasks].sort(
      (a, b) =>
        (priorityOrder[a.priority as keyof typeof priorityOrder] ?? 3) -
        (priorityOrder[b.priority as keyof typeof priorityOrder] ?? 3)
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((column) => {
        const Icon = column.icon
        const isDropTarget = dragOverColumn === column.id && draggedTask

        return (
          <div
            key={column.id}
            className={`${column.bgColor} rounded-lg p-4 min-h-[600px] flex flex-col transition-all duration-200 ${
              isDropTarget ? 'ring-2 ring-offset-2 ring-green-400 shadow-lg' : ''
            }`}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className="flex items-center space-x-2 mb-4">
              <Icon className={`w-5 h-5 ${column.color}`} />
              <h3 className="font-semibold text-gray-900">{column.title}</h3>
              <span className="ml-auto bg-white px-2 py-1 rounded text-sm font-medium text-gray-700">
                {column.tasks.length}
              </span>
            </div>

            {/* Drop Zone */}
            <div
              className={`flex-1 rounded-lg border-2 border-dashed transition-all duration-200 p-3 space-y-3 ${
                isDropTarget
                  ? 'border-green-400 bg-white/80'
                  : 'border-gray-300 bg-white/30'
              }`}
            >
              {column.tasks.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <p className="text-sm">
                    {draggedTask && isDropTarget
                      ? 'Suelta aquí'
                      : 'Sin tareas'}
                  </p>
                </div>
              ) : (
                sortTasksByPriority(column.tasks).map((task) => (
                  <div
                    key={task._id}
                    draggable
                    onDragStart={(e) => {
                      e.stopPropagation()
                      onDragStart(task)
                    }}
                    className="cursor-grab active:cursor-grabbing hover:opacity-80 transition-opacity"
                  >
                    <TaskCard task={task} project={project} />
                  </div>
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
