import { Navigate } from 'react-router-dom'
import { useIsAuthenticated } from '@/store/authStore'
import { type ReactNode } from 'react'

interface PublicRouteProps {
  children: ReactNode
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const isAuthenticated = useIsAuthenticated()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
