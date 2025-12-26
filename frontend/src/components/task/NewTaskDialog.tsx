import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, AlertCircle, Zap, Flag } from 'lucide-react'
import { useCreateTask } from '@/hooks/useTasks'
import { useProjects } from '@/hooks/useProjects'
import { taskSchema, type TaskFormData } from '@/schemas/task'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'

interface NewTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
}

export default function NewTaskDialog({ open, onOpenChange, projectId }: NewTaskDialogProps) {
  const createTask = useCreateTask()
  const { data: projects } = useProjects(1, 100)
  const user = useAuthStore((state) => state.user)
  const [selectedPriority, setSelectedPriority] = useState<'baja' | 'media' | 'alta'>('media')
  const [selectedAssignee, setSelectedAssignee] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      status: 'pendiente',
      priority: 'media',
      project: projectId,
    },
  })

  // Update project field when projectId changes
  useEffect(() => {
    setValue('project', projectId)
  }, [projectId, setValue])

  const onSubmit = async (data: TaskFormData) => {
    try {
      await createTask.mutateAsync({
        title: data.title,
        description: data.description,
        project: projectId,
        priority: selectedPriority,
        status: 'pendiente',
        assignedTo: selectedAssignee || undefined,
      })
      reset({
        title: '',
        description: '',
        project: projectId,
        priority: 'media',
        status: 'pendiente',
        assignedTo: '',
      })
      setSelectedPriority('media')
      setSelectedAssignee('')
      onOpenChange(false)
      toast.success('Tarea creada exitosamente')
    } catch (err: unknown) {
      let errorMessage = 'Error al crear la tarea'

      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || errorMessage
      } else if (err instanceof Error) {
        errorMessage = err.message
      }

      toast.error(errorMessage)
    }
  }

  const handleClose = () => {
    reset({
      title: '',
      description: '',
      project: projectId,
      priority: 'media',
      status: 'pendiente',
      assignedTo: '',
    })
    setSelectedPriority('media')
    setSelectedAssignee('')
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={handleClose} />

      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Nueva Tarea</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Título *
            </label>
            <input
              id="title"
              type="text"
              {...register('title')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ingresa el título de la tarea"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Descripción (Opcional)
            </label>
            <textarea
              id="description"
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              placeholder="Ingresa la descripción de la tarea"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Prioridad *
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedPriority('baja')
                  setValue('priority', 'baja')
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border-2 transition-all ${
                  selectedPriority === 'baja'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-green-300'
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Baja</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedPriority('media')
                  setValue('priority', 'media')
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border-2 transition-all ${
                  selectedPriority === 'media'
                    ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-yellow-300'
                }`}
              >
                <Flag className="w-4 h-4" />
                <span className="text-sm font-medium">Media</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedPriority('alta')
                  setValue('priority', 'alta')
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border-2 transition-all ${
                  selectedPriority === 'alta'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-red-300'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">Alta</span>
              </button>
            </div>
            {errors.priority && (
              <p className="mt-1 text-sm text-red-600">
                {errors.priority.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Responsable (Opcional)
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedAssignee('')}
                className={`flex-1 py-2 px-3 rounded-lg border-2 transition-all text-sm font-medium ${
                  selectedAssignee === ''
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'
                }`}
              >
                Sin Asignar
              </button>
              <button
                type="button"
                onClick={() => setSelectedAssignee(user?._id || '')}
                className={`flex-1 py-2 px-3 rounded-lg border-2 transition-all text-sm font-medium ${
                  selectedAssignee === user?._id
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-green-300'
                }`}
              >
                Mi
              </button>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creando...' : 'Crear Tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
