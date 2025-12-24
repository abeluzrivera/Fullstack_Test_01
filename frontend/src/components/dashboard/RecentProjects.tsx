import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useProjects } from '@/hooks/useProjects'
import { useTasks } from '@/hooks/useTasks'
import NewProjectDialog from '@/components/project/NewProjectDialog'
import type { Project } from '@/types/api'

interface ProjectCardProps {
  project: Project
}

function ProjectCardWithTasks({ project }: ProjectCardProps) {
  const { data: tasks } = useTasks(project._id)

  const totalTasks = tasks?.length || 0
  const completedTasks =
    tasks?.filter((task) => task.status === 'completada').length || 0
  const progress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {project.name}
      </h3>

      {project.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {project.description}
        </p>
      )}

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">Progress</span>
          <span className="text-sm font-semibold text-gray-900">
            {progress}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          {completedTasks}/{totalTasks} tasks
        </span>
        <span>{project.collaborators.length + 1} team members</span>
      </div>
    </div>
  )
}

export default function RecentProjects() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { data: projects, isLoading } = useProjects(1, 3)

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Recent Projects</h2>
        <button
          onClick={() => setDialogOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Project</span>
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : projects?.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500">
            No projects yet. Create your first project!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.map((project) => (
            <ProjectCardWithTasks key={project._id} project={project} />
          ))}
        </div>
      )}

      <NewProjectDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  )
}
