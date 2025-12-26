import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '@/api/users'
import type { User } from '@/types/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, X, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface AssignUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAssign: (userId: string) => Promise<void>
  currentAssignee?: string
  projectTeam?: User[]  // Solo mostrar usuarios del proyecto
}

export function AssignUserDialog({
  open,
  onOpenChange,
  onAssign,
  currentAssignee,
  projectTeam = [],
}: AssignUserDialogProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isAssigning, setIsAssigning] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '' })
  const queryClient = useQueryClient()

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAllUsers(),
    enabled: open,
  })

  const createUserMutation = useMutation({
    mutationFn: () =>
      usersApi.createUser(createForm.name, createForm.email, createForm.password),
    onSuccess: async (newUser) => {
      await queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Usuario creado correctamente')
      setCreateForm({ name: '', email: '', password: '' })
      setShowCreateForm(false)
      // Auto-asignar el nuevo usuario
      await handleAssign(newUser._id)
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Error al crear usuario'
      toast.error(message)
    },
  })

  // Obtener IDs de miembros del equipo del proyecto
  const projectUserIds = useMemo(() => {
    return projectTeam?.map((u: User) => u._id) || []
  }, [projectTeam])

  // Filtrar solo usuarios que están en el equipo del proyecto
  const availableUsers = useMemo(() => {
    if (!projectTeam || projectTeam.length === 0) {
      return []
    }
    return users.filter((user: User) => projectUserIds.includes(user._id))
  }, [users, projectUserIds, projectTeam])

  const filteredUsers = useMemo(() => {
    return availableUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [availableUsers, searchTerm])

  const handleAssign = async (userId: string) => {
    setIsAssigning(true)
    try {
      await onAssign(userId)
      // Fuerza refetch de todas las queries de tareas
      await queryClient.refetchQueries({ queryKey: ['tasks'] })
      await queryClient.refetchQueries({ queryKey: ['dashboard'] })
      toast.success('Usuario asignado')
      setSearchTerm('')
      onOpenChange(false)
    } catch (error) {
      toast.error('Error al asignar usuario')
      console.error(error)
    } finally {
      setIsAssigning(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createForm.name || !createForm.email || !createForm.password) {
      toast.error('Completa todos los campos')
      return
    }
    if (createForm.password.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres')
      return
    }
    createUserMutation.mutate()
  }

  if (!open) return null

  if (showCreateForm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Crear Nuevo Usuario</h2>
              <p className="text-sm text-gray-500 mt-1">Completa los datos</p>
            </div>
            <button
              onClick={() => {
                setShowCreateForm(false)
                setCreateForm({ name: '', email: '', password: '' })
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleCreateUser} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Nombre
              </label>
              <Input
                type="text"
                placeholder="Nombre completo"
                value={createForm.name}
                onChange={(e) =>
                  setCreateForm({ ...createForm, name: e.target.value })
                }
                disabled={createUserMutation.isPending}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Email
              </label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={createForm.email}
                onChange={(e) =>
                  setCreateForm({ ...createForm, email: e.target.value })
                }
                disabled={createUserMutation.isPending}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Contraseña
              </label>
              <Input
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={createForm.password}
                onChange={(e) =>
                  setCreateForm({ ...createForm, password: e.target.value })
                }
                disabled={createUserMutation.isPending}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowCreateForm(false)
                  setCreateForm({ name: '', email: '', password: '' })
                }}
                disabled={createUserMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={createUserMutation.isPending}
              >
                {createUserMutation.isPending ? 'Creando...' : 'Crear Usuario'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Asignar Responsable</h2>
            <p className="text-sm text-gray-500 mt-1">
              Selecciona un usuario de la lista
            </p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {!projectTeam || projectTeam.length === 0 ? (
            <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  No hay miembros en el equipo
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Agrega usuarios al proyecto desde "Gestionar Equipo"
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No se encontraron usuarios</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredUsers.map((user) => (
                      <button
                        key={user._id}
                        onClick={() => handleAssign(user._id)}
                        disabled={isAssigning || user._id === currentAssignee}
                        className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                          user._id === currentAssignee
                            ? 'bg-green-50 border-green-300 text-green-900 cursor-not-allowed'
                            : 'hover:bg-gray-50 border-gray-200 hover:border-green-300 cursor-pointer'
                        } ${isAssigning ? 'opacity-50' : ''}`}
                      >
                        <div className="font-medium text-sm">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                        {user._id === currentAssignee && (
                          <div className="text-xs text-green-700 mt-1">✓ Asignado actualmente</div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2 p-6 border-t bg-gray-50">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="flex-1 gap-2"
            onClick={() => setShowCreateForm(true)}
          >
            <Plus className="w-4 h-4" />
            Crear Usuario
          </Button>
        </div>
      </div>
    </div>
  )
}

