import { useState } from 'react'
import type { Task } from '@/types/api'
import { useUpdateTask, useDeleteTask } from '@/hooks/useTasks'
import { useAuthStore } from '@/store/authStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { MoreVertical, AlertCircle, Clock, CheckCircle2, Trash2, Zap } from 'lucide-react'
import { toast } from 'sonner'

interface TaskCardProps {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
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

  const handleStatusChange = async (
    newStatus: 'pendiente' | 'en progreso' | 'completada',
  ) => {
    const user = useAuthStore.getState().user
    setIsUpdating(true)
    try {
      const updateData: any = { status: newStatus }
      if (!task.assignedTo && user) {
        updateData.assignedTo = user._id
      }
      await updateTask.mutateAsync({
        id: task._id,
        data: updateData,
      })
      toast.success('Estado actualizado')
    } catch (error) {
      console.error('Failed to update status:', error)
      toast.error('Error al actualizar el estado')
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePriorityChange = async (
    newPriority: 'baja' | 'media' | 'alta',
  ) => {
    setIsUpdating(true)
    try {
      await updateTask.mutateAsync({
        id: task._id,
        data: { priority: newPriority },
      })
      toast.success('Prioridad actualizada')
    } catch (error) {
      console.error('Failed to update priority:', error)
      toast.error('Error al actualizar la prioridad')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAssigneeChange = async (assigneeId: string | null) => {
    setIsUpdating(true)
    try {
      await updateTask.mutateAsync({
        id: task._id,
        data: { assignedTo: assigneeId },
      })
      toast.success('Responsable actualizado')
    } catch (error) {
      console.error('Failed to update assignee:', error)
      toast.error('Error al actualizar el responsable')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteTask = async () => {
    setIsUpdating(true)
    try {
      await deleteTask.mutateAsync(task._id)
      toast.success('Tarea eliminada')
      setDeleteDialogOpen(false)
    } catch (error) {
      console.error('Failed to delete task:', error)
      toast.error('Error al eliminar la tarea')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div
      className={`rounded-lg p-4 shadow-sm border transition-all ${
        task.status === 'completada'
          ? 'bg-gray-100 border-gray-200 opacity-60'
          : 'bg-white border-gray-200 hover:shadow-md'
      } ${isUpdating ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <h4
            className={`font-semibold flex-1 min-w-0 break-words ${
              task.status === 'completada'
                ? 'line-through text-gray-500'
                : 'text-gray-900'
            }`}
          >
            {task.title}
          </h4>
          {task.assignedTo && (
            <div
              className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 cursor-help"
              title={
                typeof task.assignedTo === 'string'
                  ? task.assignedTo
                  : task.assignedTo.name
              }
            >
              {typeof task.assignedTo === 'string'
                ? 'U'
                : getInitials(task.assignedTo.name)}
            </div>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 hover:bg-gray-100 rounded flex-shrink-0">
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="px-2 py-1.5 text-xs font-semibold text-gray-700">
              Estado
            </div>
            <DropdownMenuItem onClick={() => handleStatusChange('pendiente')} className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              Por Hacer
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('en progreso')} className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              En Progreso
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('completada')} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              Completada
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5 text-xs font-semibold text-gray-700">
              Prioridad
            </div>
            <DropdownMenuItem onClick={() => handlePriorityChange('baja')} className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-green-600" />
              Baja
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handlePriorityChange('media')} className="flex items-center gap-2">
              <span className="w-4 h-4 bg-yellow-500 rounded"></span>
              Media
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handlePriorityChange('alta')} className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-red-600" />
              Alta
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5 text-xs font-semibold text-gray-700">
              Responsable
            </div>
            <DropdownMenuItem onClick={() => handleAssigneeChange(null)} className="flex items-center gap-2">
              Sin Asignar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)} className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
              <Trash2 className="w-4 h-4" />
              Eliminar Tarea
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {task.status !== 'completada' && (
        <>
          {task.description && (
            <p className="text-sm text-gray-600 mb-3 mt-3">{task.description}</p>
          )}

          <p className="text-xs text-gray-500 mb-3">
            {typeof task.project === 'string' ? task.project : task.project.name}
          </p>

          <div className="flex items-center space-x-2">
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}
            >
              {task.priority}
            </span>
          </div>
        </>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>¿Eliminar tarea?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. La tarea "{task.title}" será eliminada permanentemente.
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTask}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
