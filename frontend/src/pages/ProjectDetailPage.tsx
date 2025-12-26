import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus } from 'lucide-react'
import { useTasks, useUpdateTask } from '@/hooks/useTasks'
import { useProjects } from '@/hooks/useProjects'
import { useAuthStore } from '@/store/authStore'
import NewTaskDialog from '@/components/task/NewTaskDialog'
import { KanbanBoard } from '../components/task/KanbanBoard'
import type { Task } from '@/types/api'

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)

  const { data: projects } = useProjects(1, 100)
  const { data: tasks, isLoading } = useTasks(projectId)
  const updateTask = useUpdateTask()

  const project = projects?.find((p) => p._id === projectId)

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center space-x-2 text-green-600 hover:text-green-700 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Projects</span>
        </button>
        <div className="text-center py-12">
          <p className="text-gray-500">Project not found</p>
        </div>
      </div>
    )
  }

  const handleDragStart = (task: Task) => {
    setDraggedTask(task)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDropOnColumn = async (status: string) => {
    if (!draggedTask) return

    const user = useAuthStore.getState().user
    try {
      const updateData: any = { status }
      if (!draggedTask.assignedTo && user) {
        updateData.assignedTo = user._id
      }
      await updateTask.mutateAsync({
        id: draggedTask._id,
        data: updateData,
      })
      setDraggedTask(null)
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  const tasksByStatus = {
    pendiente: tasks?.filter((t) => t.status === 'pendiente') || [],
    'en progreso': tasks?.filter((t) => t.status === 'en progreso') || [],
    completada: tasks?.filter((t) => t.status === 'completada') || [],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-8 py-6">
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center space-x-2 text-green-600 hover:text-green-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Projects</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              <p className="text-gray-500 mt-1">{project.description}</p>
            </div>
            <button
              onClick={() => setDialogOpen(true)}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>New Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="p-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-3 border-green-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <KanbanBoard
            tasksByStatus={tasksByStatus}
            onDragStart={handleDragStart}
            onDropOnColumn={handleDropOnColumn}
            draggedTask={draggedTask}
          />
        )}
      </div>

      {/* New Task Dialog */}
      <NewTaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        projectId={projectId || ''}
      />
    </div>
  )
}
