import z from 'zod'

export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
})

export const settingsSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
})

export type SettingsFormData = z.infer<typeof settingsSchema>
export type ProjectFormData = z.infer<typeof projectSchema>
