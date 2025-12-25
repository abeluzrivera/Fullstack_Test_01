import { useState } from 'react'
import { Settings as SettingsIcon, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'
import StatCard, { type StatCardProps } from '@/components/dashboard/StatCard'
import RecentProjects from '@/components/dashboard/RecentProjects'
import ActivityOverview from '@/components/dashboard/ActivityOverview'
import { useDashboardStats } from '@/hooks/useDashboard'
import UserSettingsDialog from '@/components/user/UserSettingsDialog'
import { messages } from '@/config/messages'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()
  const { data: stats, isLoading } = useDashboardStats()
  const [settingsOpen, setSettingsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const statCards: StatCardProps[] = [
    {
      title: messages.dashboard.totalProjects,
      value: stats?.projects.total.toString() || '0',
      icon: 'folder' as const,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500',
    },
    {
      title: messages.dashboard.totalTasks,
      value: stats?.tasks.total.toString() || '0',
      icon: 'list' as const,
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-500',
    },
    {
      title: messages.dashboard.assignedToMe,
      value: stats?.tasks.assigned.toString() || '0',
      icon: 'trending' as const,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-500',
    },
    {
      title: messages.dashboard.toDo,
      value: stats?.tasks.byStatus.pendiente?.toString() || '0',
      icon: 'circle' as const,
      bgColor: 'bg-gray-50',
      iconColor: 'text-gray-500',
    },
    {
      title: messages.dashboard.inProgress,
      value: stats?.tasks.byStatus['en progreso']?.toString() || '0',
      icon: 'clock' as const,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-500',
    },
    {
      title: messages.dashboard.completed,
      value: stats?.tasks.byStatus.completada?.toString() || '0',
      icon: 'check' as const,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-8 py-4 flex items-center justify-between pl-16 lg:pl-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{messages.dashboard.welcomeTitle}</h1>
            <p className="text-gray-500 mt-1">
              {messages.dashboard.welcomeMessage(user?.name)}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold hover:bg-blue-700 transition-colors cursor-pointer">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
                  <SettingsIcon className="w-4 h-4 mr-2" />
                  {messages.header.settings}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {messages.header.logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="px-8 py-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {statCards.map((stat) => (
                <StatCard key={stat.title} {...stat} />
              ))}
            </div>

            <RecentProjects />

            {stats?.recentTasks && stats.recentTasks.length > 0 && (
              <ActivityOverview />
            )}
          </>
        )}
      </div>

      <UserSettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  )
}
