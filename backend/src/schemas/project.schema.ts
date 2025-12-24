import { z } from 'zod'

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(5, 'Project name must be at least 5 characters')
    .max(80, 'Project name cannot exceed 80 characters')
    .trim(),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .trim()
    .optional(),
})

export const updateProjectSchema = z.object({
  name: z
    .string()
    .min(5, 'Project name must be at least 5 characters')
    .max(80, 'Project name cannot exceed 80 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .trim()
    .optional(),
})

export const addCollaboratorSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
export type AddCollaboratorInput = z.infer<typeof addCollaboratorSchema>
