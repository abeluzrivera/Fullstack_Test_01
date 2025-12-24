import { Navigate } from 'react-router-dom'
import { useIsAuthenticated } from '@/store/authStore'
import SidebarLayout from '@/components/layout/SidebarLayout'
import { type ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useIsAuthenticated()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <SidebarLayout>{children}</SidebarLayout>
}
