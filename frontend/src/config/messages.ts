/**
 * Configuración centralizada de mensajes de la aplicación
 * Los placeholders {name} se reemplazan dinámicamente
 */

export const messages = {
  dashboard: {
    // Bienvenida
    welcomeTitle: 'Dashboard',
    welcomeMessage: (name: string) => `Bienvenido, ${name || 'User'}!`,
    
    // Stats
    totalProjects: 'Total Projects',
    totalTasks: 'Total Tasks',
    assignedToMe: 'Assigned to Me',
    toDo: 'To Do',
    inProgress: 'In Progress',
    completed: 'Completed',
    
    // Sections
    recentProjects: 'Recent Projects',
    newProject: 'New Project',
    
    // Loading
    loading: 'Cargando...',
  },

  header: {
    settings: 'Settings',
    logout: 'Logout',
  },

  sidebar: {
    projectManager: 'Project Manager',
    dashboard: 'Dashboard',
    projects: 'Projects',
    tasks: 'Tasks',
  },

  errors: {
    loadingFailed: 'Error al cargar los datos',
    unauthorized: 'No autorizado',
    notFound: 'No encontrado',
  },

  success: {
    saved: 'Guardado exitosamente',
    deleted: 'Eliminado exitosamente',
    updated: 'Actualizado exitosamente',
  },
}
