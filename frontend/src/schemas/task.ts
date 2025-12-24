import { z } from 'zod'

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional(),
  project: z.string().min(1, 'Project is required'),
  priority: z.enum(['baja', 'media', 'alta']),
  status: z.enum(['pendiente', 'en progreso', 'completada']),
})

export type TaskFormData = z.infer<typeof taskSchema>
