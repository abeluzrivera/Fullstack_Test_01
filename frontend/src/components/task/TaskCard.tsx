import { useState } from 'react'
import type { Task } from '@/types/api'
import { useUpdateTask } from '@/hooks/useTasks'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { MoreVertical } from 'lucide-react'
import { toast } from 'sonner'

interface TaskCardProps {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const updateTask = useUpdateTask()

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
    setIsUpdating(true)
    try {
      await updateTask.mutateAsync({
        id: task._id,
        data: { status: newStatus },
      })
      toast.success('Task status updated')
    } catch (error) {
      console.error('Failed to update status:', error)
      toast.error('Failed to update task status')
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
      toast.success('Task priority updated')
    } catch (error) {
      console.error('Failed to update priority:', error)
      toast.error('Failed to update task priority')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div
      className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${isUpdating ? 'opacity-50' : ''}`}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-900 flex-1">{task.title}</h4>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 hover:bg-gray-100 rounded">
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="px-2 py-1.5 text-xs font-semibold text-gray-500">
              Change Status
            </div>
            <DropdownMenuItem onClick={() => handleStatusChange('pendiente')}>
              To Do
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('en progreso')}>
              In Progress
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('completada')}>
              Done
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5 text-xs font-semibold text-gray-500">
              Change Priority
            </div>
            <DropdownMenuItem onClick={() => handlePriorityChange('baja')}>
              Low
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handlePriorityChange('media')}>
              Medium
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handlePriorityChange('alta')}>
              High
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
      )}

      <p className="text-xs text-gray-500 mb-3">
        {typeof task.project === 'string' ? task.project : task.project.name}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}
          >
            {task.priority}
          </span>
        </div>
        {task.assignedTo && (
          <div
            className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold"
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
    </div>
  )
}
