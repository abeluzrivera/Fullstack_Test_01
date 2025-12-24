import { z } from 'zod'

const taskStatusEnum = z.enum(['pendiente', 'en progreso', 'completada'])
const taskPriorityEnum = z.enum(['baja', 'media', 'alta'])

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(5, 'Task title must be at least 5 characters')
    .max(120, 'Task title cannot exceed 120 characters')
    .trim(),
  description: z
    .string()
    .max(1000, 'Description cannot exceed 1000 characters')
    .trim()
    .optional(),
  project: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid project ID format'),
  assignedTo: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format')
    .optional(),
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
})

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(5, 'Task title must be at least 5 characters')
    .max(120, 'Task title cannot exceed 120 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .max(1000, 'Description cannot exceed 1000 characters')
    .trim()
    .optional(),
  assignedTo: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format')
    .optional()
    .nullable(),
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
})

export const taskFilterSchema = z.object({
  project: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid project ID format')
    .optional(),
  assignedTo: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format')
    .optional(),
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
  sort: z
    .enum([
      'createdAt',
      '-createdAt',
      'priority',
      '-priority',
      'status',
      '-status',
    ])
    .optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type TaskFilterInput = z.infer<typeof taskFilterSchema>
