import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '@/api/users'
import { projectsApi } from '@/api/projects'
import type { Project } from '@/types/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import { toast } from 'sonner'

interface ManageTeamProps {
  project: Project
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ManageTeam({ project, open, onOpenChange }: ManageTeamProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const queryClient = useQueryClient()

  const { data: allUsers = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAllUsers(),
    enabled: open,
  })

  const addCollaboratorMutation = useMutation({
    mutationFn: (userId: string) => projectsApi.addCollaborator(project._id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Colaborador agregado')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Error al agregar colaborador'
      toast.error(message)
    },
  })

  const removeCollaboratorMutation = useMutation({
    mutationFn: (userId: string) => projectsApi.removeCollaborator(project._id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Colaborador removido')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Error al remover colaborador'
      toast.error(message)
    },
  })

  // Usuarios que NO están en el proyecto
  const availableUsers = useMemo(() => {
    const projectUserIds = new Set([
      project.owner._id,
      ...project.collaborators.map((c) => c._id),
    ])
    return allUsers.filter(
      (user) =>
        !projectUserIds.has(user._id) &&
        (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }, [allUsers, project, searchTerm])

  // Colaboradores actuales
  const currentTeam = [project.owner, ...project.collaborators]

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Gestionar Equipo</h2>
            <p className="text-sm text-gray-500 mt-1">{project.name}</p>
          </div>
          <button
            onClick={() => {
              onOpenChange(false)
              setSearchTerm('')
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Equipo Actual */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Miembros del Equipo</h3>
            <div className="space-y-2">
              {currentTeam.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {member._id === project.owner._id ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        Propietario
                      </span>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          removeCollaboratorMutation.mutate(member._id)
                        }
                        disabled={removeCollaboratorMutation.isPending}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agregar Colaborador */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Agregar Colaborador</h3>
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar usuario por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              {availableUsers.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">
                    {searchTerm
                      ? 'No se encontraron usuarios disponibles'
                      : 'Todos los usuarios ya están en el equipo'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {availableUsers.map((user) => (
                    <button
                      key={user._id}
                      onClick={() => {
                        addCollaboratorMutation.mutate(user._id)
                        setSearchTerm('')
                      }}
                      disabled={addCollaboratorMutation.isPending}
                      className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all"
                    >
                      <div className="font-medium text-sm text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 p-6 border-t bg-gray-50 sticky bottom-0">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => {
              onOpenChange(false)
              setSearchTerm('')
            }}
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  )
}
