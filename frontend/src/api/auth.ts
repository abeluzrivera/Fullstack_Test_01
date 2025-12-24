import { apiClient } from './client'
import type { LoginRequest, RegisterRequest, AuthResponse, ApiSuccess } from '@/types/api'

export const authApi = {
  login: async (data: LoginRequest) => {
    const response = await apiClient.post<ApiSuccess<AuthResponse>>('/auth/login', data)
    return response.data.data
  },

  register: async (data: RegisterRequest) => {
    const response = await apiClient.post<ApiSuccess<AuthResponse>>('/auth/register', data)
    return response.data.data
  },

  logout: async () => {
    await apiClient.post('/auth/logout')
  },

  getProfile: async () => {
    const response = await apiClient.get('/auth/profile')
    return response.data
  },
}
