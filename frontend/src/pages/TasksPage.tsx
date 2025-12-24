import { useState } from 'react'
import {
  Plus,
  Filter as FilterIcon,
  ArrowUpDown,
  Settings as SettingsIcon,
  LogOut,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'
import { useTasks } from '@/hooks/useTasks'
import { useProjects } from '@/hooks/useProjects'
import { KanbanColumn } from '@/components/task/KanbanColumn'
import NewTaskDialog from '@/components/task/NewTaskDialog'
import SearchBar from '@/components/common/SearchBar'
import UserSettingsDialog from '@/components/user/UserSettingsDialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type SortOption =
  | 'newest'
  | 'oldest'
  | 'priority-high'
  | 'priority-low'
  | 'title-az'
  | 'title-za'

export default function TasksPage() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterProject, setFilterProject] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOption>('newest')

  const { data: tasks, isLoading } = useTasks()
  const { data: projects } = useProjects(1, 100)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  let processedTasks = tasks || []

  if (searchQuery) {
    processedTasks = processedTasks.filter((task) => {
      const query = searchQuery.toLowerCase()
      return (
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
      )
    })
  }

  if (filterPriority !== 'all') {
    processedTasks = processedTasks.filter(
      (task) => task.priority === filterPriority,
    )
  }

  if (filterProject !== 'all') {
    processedTasks = processedTasks.filter((task) => {
      const projectId =
        typeof task.project === 'string' ? task.project : task.project._id
      return projectId === filterProject
    })
  }

  processedTasks = [...processedTasks].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'priority-high':
        const priorityOrder = { alta: 3, media: 2, baja: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      case 'priority-low':
        const priorityOrderLow = { alta: 3, media: 2, baja: 1 }
        return priorityOrderLow[a.priority] - priorityOrderLow[b.priority]
      case 'title-az':
        return a.title.localeCompare(b.title)
      case 'title-za':
        return b.title.localeCompare(a.title)
      default:
        return 0
    }
  })

  const groupedTasks = {
    pendiente: processedTasks.filter((task) => task.status === 'pendiente'),
    'en progreso': processedTasks.filter(
      (task) => task.status === 'en progreso',
    ),
    completada: processedTasks.filter((task) => task.status === 'completada'),
  }

  const activeFilters = [
    filterPriority !== 'all' && 'Priority',
    filterProject !== 'all' && 'Project',
  ].filter(Boolean)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-8 py-4 flex items-center justify-between pl-16 lg:pl-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search tasks..."
            className="flex-1 max-w-xl"
          />
          <div className="flex items-center space-x-4 ml-6">
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
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tasks</h1>
            <p className="text-gray-500">Organize and track all your tasks</p>
          </div>
          <button
            onClick={() => setDialogOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Task</span>
          </button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <FilterIcon className="w-4 h-4" />
                  <span>Filter</span>
                  {activeFilters.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                      {activeFilters.length}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500">
                  Filter by Priority
                </div>
                <DropdownMenuItem onClick={() => setFilterPriority('all')}>
                  <span
                    className={filterPriority === 'all' ? 'font-semibold' : ''}
                  >
                    All Priorities
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterPriority('alta')}>
                  <span
                    className={filterPriority === 'alta' ? 'font-semibold' : ''}
                  >
                    🔴 High Priority
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterPriority('media')}>
                  <span
                    className={
                      filterPriority === 'media' ? 'font-semibold' : ''
                    }
                  >
                    🟡 Medium Priority
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterPriority('baja')}>
                  <span
                    className={filterPriority === 'baja' ? 'font-semibold' : ''}
                  >
                    🟢 Low Priority
                  </span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500">
                  Filter by Project
                </div>
                <DropdownMenuItem onClick={() => setFilterProject('all')}>
                  <span
                    className={filterProject === 'all' ? 'font-semibold' : ''}
                  >
                    All Projects
                  </span>
                </DropdownMenuItem>
                {projects?.map((project) => (
                  <DropdownMenuItem
                    key={project._id}
                    onClick={() => setFilterProject(project._id)}
                  >
                    <span
                      className={
                        filterProject === project._id ? 'font-semibold' : ''
                      }
                    >
                      {project.name}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <ArrowUpDown className="w-4 h-4" />
                  <span>Sort</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem onClick={() => setSortBy('newest')}>
                  <span className={sortBy === 'newest' ? 'font-semibold' : ''}>
                    Newest First
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('oldest')}>
                  <span className={sortBy === 'oldest' ? 'font-semibold' : ''}>
                    Oldest First
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortBy('priority-high')}>
                  <span
                    className={
                      sortBy === 'priority-high' ? 'font-semibold' : ''
                    }
                  >
                    Priority: High to Low
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('priority-low')}>
                  <span
                    className={sortBy === 'priority-low' ? 'font-semibold' : ''}
                  >
                    Priority: Low to High
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortBy('title-az')}>
                  <span
                    className={sortBy === 'title-az' ? 'font-semibold' : ''}
                  >
                    Title: A to Z
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('title-za')}>
                  <span
                    className={sortBy === 'title-za' ? 'font-semibold' : ''}
                  >
                    Title: Z to A
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <KanbanColumn
              title="Pending"
              count={groupedTasks.pendiente.length}
              tasks={groupedTasks.pendiente}
              status="pendiente"
            />
            <KanbanColumn
              title="In Progress"
              count={groupedTasks['en progreso'].length}
              tasks={groupedTasks['en progreso']}
              status="en progreso"
            />
            <KanbanColumn
              title="Completed"
              count={groupedTasks.completada.length}
              tasks={groupedTasks.completada}
              status="completada"
            />
          </div>
        )}
      </div>

      <NewTaskDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
      <UserSettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  )
}
