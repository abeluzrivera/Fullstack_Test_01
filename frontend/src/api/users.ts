import { apiClient } from './client'
import type { ApiSuccess, User, Project } from '@/types/api'

export const usersApi = {
  getAllUsers: async () => {
    const response = await apiClient.get<ApiSuccess<User[]>>('/users')
    return response.data.data
  },

  createUser: async (name: string, email: string, password: string) => {
    const response = await apiClient.post<ApiSuccess<User>>('/users', {
      name,
      email,
      password,
    })
    return response.data.data
  },

  addCollaborator: async (projectId: string, userId: string) => {
    const response = await apiClient.post<ApiSuccess<Project>>(
      `/projects/${projectId}/collaborators`,
      { userId },
    )
    return response.data
  },

  removeCollaborator: async (projectId: string, userId: string) => {
    const response = await apiClient.delete<ApiSuccess<Project>>(
      `/projects/${projectId}/collaborators/${userId}`,
    )
    return response.data
  },
}
