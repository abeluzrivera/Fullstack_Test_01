import { apiClient } from './client'
import type { DashboardStats, ApiSuccess } from '@/types/api'

export const dashboardApi = {
  getStats: async () => {
    const response =
      await apiClient.get<ApiSuccess<DashboardStats>>('/dashboard/stats')
    return response.data.data
  },
}
