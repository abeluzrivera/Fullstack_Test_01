import { useState } from 'react'
import { X, UserPlus, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { usersApi } from '@/api/users'
import { useQueryClient } from '@tanstack/react-query'
import type { Project } from '@/types/api'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

interface ManageTeamDialogProps {
  open: boolean
  onClose: () => void
  project: Project
}

export default function ManageTeamDialog({
  open,
  onClose,
  project,
}: ManageTeamDialogProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const currentUser = useAuthStore((state) => state.user)
  const queryClient = useQueryClient()

  const handleAddCollaborator = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const user = await usersApi.searchByEmail(email)

      await usersApi.addCollaborator(project._id, user._id)

      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['project', project._id] })

      setEmail('')
      toast.success('Team member added successfully')
    } catch (err: unknown) {
      let errorMessage = 'Failed to add collaborator'

      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || errorMessage
      } else if (err instanceof Error) {
        errorMessage = err.message
      }

      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveCollaborator = async (userId: string) => {
    try {
      await usersApi.removeCollaborator(project._id, userId)

      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['project', project._id] })

      toast.success('Team member removed successfully')
    } catch (err) {
      console.error('Failed to remove collaborator:', err)
      toast.error('Failed to remove team member')
    }
  }

  if (!open) return null

  const teamMembers = [project.owner, ...project.collaborators]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 z-10 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Manage Team</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleAddCollaborator} className="mb-6">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Add Team Member by Email
          </label>
          <div className="flex space-x-2">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@example.com"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              <span>{isLoading ? 'Adding...' : 'Add'}</span>
            </button>
          </div>
        </form>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Team Members ({teamMembers.length})
          </h3>
          <div className="space-y-2">
            {teamMembers.map((member) => {
              const isOwner = member._id === project.owner._id
              const isCurrentUser = member._id === currentUser?._id

              return (
                <div
                  key={member._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {member.name}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs text-gray-500">
                            (You)
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isOwner ? (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                        Owner
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRemoveCollaborator(member._id)}
                        className="px-3 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
