import { useState } from 'react'
import { useTasks } from '@/hooks/useTasks'
import { useDeleteProject } from '@/hooks/useProjects'
import type { Project, TeamMember } from '@/types/api'
import { Trash2, MoreVertical, Settings, Users } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import ManageTeamDialog from './ManageTeamDialog'
import ProjectSettingsDialog from './ProjectSettingsDialog'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { data: tasks } = useTasks(project._id)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [teamDialogOpen, setTeamDialogOpen] = useState(false)
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)
  const deleteProject = useDeleteProject()

  const totalTasks = tasks?.length || 0
  const completedTasks =
    tasks?.filter((task) => task.status === 'completada').length || 0
  const progress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const teamMembers: TeamMember[] = [project.owner, ...project.collaborators]

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getAvatarColor = (index: number) => {
    const colors = [
      'bg-blue-600',
      'bg-purple-600',
      'bg-green-600',
      'bg-orange-600',
    ]
    return colors[index % colors.length]
  }

  const handleDelete = async () => {
    try {
      await deleteProject.mutateAsync(project._id)
      setDeleteDialogOpen(false)
      toast.success('Project deleted successfully')
    } catch (error) {
      console.error('Failed to delete project:', error)
      let errorMessage = 'Failed to delete project. Please try again.'

      if (error instanceof AxiosError) {
        errorMessage = error.response?.data.message || errorMessage
      } else if (error instanceof Error) {
        if (error.message.includes('403')) {
          errorMessage = 'You do not have permission to delete this project.'
        } else if (error.message.includes('404')) {
          errorMessage = 'Project not found.'
        } else if (error.message.includes('Network')) {
          errorMessage = 'Network error. Please check your connection.'
        }
      }

      toast.error(errorMessage)
      setDeleteDialogOpen(false)
    }
  }

  return (
    <>
      <div className="bg-white rounded-xl p-6 w-fit shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900">
              {project.name}
            </h3>
            {project.description && (
              <p className="text-gray-600 text-sm">{project.description}</p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 hover:bg-gray-100 rounded">
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTeamDialogOpen(true)}>
                <Users className="w-4 h-4 mr-2" />
                <span>Manage Team</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSettingsDialogOpen(true)}>
                <Settings className="w-4 h-4 mr-2" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 justify-betwee">
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Tasks</p>
              <div className="flex items-center space-x-2">
                <p className="text-sm font-semibold text-gray-900">
                  {completedTasks}/{totalTasks}
                </p>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Due Date</p>
              <p className="text-sm font-semibold text-gray-900">
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Team Members</p>
            <div className="flex -space-x-2">
              {teamMembers.slice(0, 4).map((member, index) => (
                <div
                  key={member._id}
                  className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold ${getAvatarColor(index)}`}
                  title={member.name}
                >
                  {getInitials(member.name)}
                </div>
              ))}
              {teamMembers.length > 4 && (
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-semibold">
                  +{teamMembers.length - 4}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{project.name}"? This action
              cannot be undone and will permanently delete all associated tasks
              and data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteProject.isPending}
            >
              {deleteProject.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ManageTeamDialog
        open={teamDialogOpen}
        onClose={() => setTeamDialogOpen(false)}
        project={project}
      />

      <ProjectSettingsDialog
        open={settingsDialogOpen}
        onClose={() => setSettingsDialogOpen(false)}
        project={project}
      />
    </>
  )
}
