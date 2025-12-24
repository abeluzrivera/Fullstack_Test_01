export interface User {
  _id: string
  name: string
  email: string
  createdAt: string
  updatedAt?: string
}

export type TeamMember = Pick<User, '_id' | 'name' | 'email'> &
  Partial<Pick<User, 'createdAt' | 'updatedAt'>>

export interface Project {
  _id: string
  name: string
  description?: string
  owner: User
  collaborators: User[]
  createdAt: string
  updatedAt: string
}

export type TaskStatus = 'pendiente' | 'en progreso' | 'completada'
export type TaskPriority = 'baja' | 'media' | 'alta'

export interface Task {
  _id: string
  title: string
  description?: string
  project: Project
  assignedTo?: User
  status: TaskStatus
  priority: TaskPriority
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface CreateProjectRequest {
  name: string
  description?: string
}

export interface UpdateProjectRequest {
  name?: string
  description?: string
}

export interface CreateTaskRequest {
  title: string
  description?: string
  project: string
  assignedTo?: string
  status?: TaskStatus
  priority?: TaskPriority
}

export interface UpdateTaskRequest {
  title?: string
  description?: string
  assignedTo?: string | null
  status?: TaskStatus
  priority?: TaskPriority
}

export interface DashboardStats {
  projects: {
    owned: number
    collaborating: number
    total: number
  }
  tasks: {
    total: number
    assigned: number
    byStatus: {
      pendiente: number
      'en progreso': number
      completada: number
    }
    byPriority: {
      baja: number
      media: number
      alta: number
    }
  }
  recentTasks: Task[]
}

export interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface ApiError {
  success: false
  message: string
  errors?: Array<{
    field: string
    message: string
  }>
}

export interface ApiSuccess<T> {
  success: true
  data: T
  message?: string
  pagination?: Pagination
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError
