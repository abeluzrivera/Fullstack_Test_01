import { apiClient } from './client'
import type { ApiSuccess, User, Project } from '@/types/api'

export const usersApi = {
  searchByEmail: async (email: string) => {
    const response = await apiClient.get<ApiSuccess<User>>(
      `/users/search?email=${encodeURIComponent(email)}`,
    )
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
