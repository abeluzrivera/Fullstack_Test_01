import { z } from 'zod'

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name cannot exceed 80 characters')
    .trim(),
  email: z.email('Enter a valid email address').toLowerCase().trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(30, 'Password cannot exceed 30 characters'),
})

export const loginSchema = z.object({
  email: z.email('Enter a valid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
