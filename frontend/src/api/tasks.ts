import { apiClient } from './client'
import type {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  ApiSuccess,
} from '@/types/api'

export const tasksApi = {
  getTasks: async (projectId?: string) => {
    const url = projectId ? `/tasks?project=${projectId}` : '/tasks'
    const response = await apiClient.get<ApiSuccess<Task[]>>(url)
    return response.data.data
  },

  getTaskById: async (id: string) => {
    const response = await apiClient.get<ApiSuccess<Task>>(`/tasks/${id}`)
    return response.data.data
  },

  createTask: async (data: CreateTaskRequest) => {
    const response = await apiClient.post<ApiSuccess<Task>>('/tasks', data)
    return response.data.data
  },

  updateTask: async (id: string, data: UpdateTaskRequest) => {
    const response = await apiClient.put<ApiSuccess<Task>>(`/tasks/${id}`, data)
    return response.data.data
  },

  deleteTask: async (id: string) => {
    await apiClient.delete(`/tasks/${id}`)
  },
}
