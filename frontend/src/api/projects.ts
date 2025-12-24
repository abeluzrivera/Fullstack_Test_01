import { apiClient } from './client'
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  ApiSuccess,
} from '@/types/api'

export const projectsApi = {
  getProjects: async (page = 1, limit = 10, search?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    })
    const response = await apiClient.get<ApiSuccess<Project[]>>(
      `/projects?${params}`,
    )
    return response.data.data
  },

  getProjectById: async (id: string) => {
    const response = await apiClient.get<ApiSuccess<Project>>(`/projects/${id}`)
    return response.data.data
  },

  createProject: async (data: CreateProjectRequest) => {
    const response = await apiClient.post<ApiSuccess<Project>>(
      '/projects',
      data,
    )
    return response.data.data
  },

  updateProject: async (id: string, data: UpdateProjectRequest) => {
    const response = await apiClient.put<ApiSuccess<Project>>(
      `/projects/${id}`,
      data,
    )
    return response.data.data
  },

  deleteProject: async (id: string) => {
    await apiClient.delete(`/projects/${id}`)
  },

  addCollaborator: async (projectId: string, userId: string) => {
    const response = await apiClient.post<ApiSuccess<Project>>(
      `/projects/${projectId}/collaborators`,
      { userId },
    )
    return response.data.data
  },

  removeCollaborator: async (projectId: string, userId: string) => {
    await apiClient.delete(`/projects/${projectId}/collaborators/${userId}`)
  },
}
