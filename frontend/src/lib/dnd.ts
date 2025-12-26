/**
 * Drag and Drop Utility Library
 * Proporciona funciones reutilizables para manejar operaciones de arrastrar y soltar
 */

export interface DragItem<T> {
  item: T
  sourceId: string
  timestamp: number
}

export interface DropZoneConfig {
  id: string
  onDropCallback: (item: any, sourceId: string, targetId: string) => Promise<void>
}

/**
 * Valida si un elemento puede ser soltado en una zona específica
 */
export const canDropItem = (
  sourceId: string,
  targetId: string,
  allowSelfDrop: boolean = false
): boolean => {
  if (!allowSelfDrop && sourceId === targetId) {
    return false
  }
  return true
}

/**
 * Obtiene datos del evento de arrastrado
 */
export const getDragData = <T>(
  dataTransfer: DataTransfer,
  key: string = 'dragItem'
): T | null => {
  try {
    const data = dataTransfer.getData('text/plain')
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Error al obtener datos de arrastrado:', error)
    return null
  }
}

/**
 * Establece datos para el evento de arrastrado
 */
export const setDragData = (
  dataTransfer: DataTransfer,
  item: any,
  key: string = 'dragItem'
): void => {
  try {
    dataTransfer.effectAllowed = 'move'
    dataTransfer.setData('text/plain', JSON.stringify(item))
  } catch (error) {
    console.error('Error al establecer datos de arrastrado:', error)
  }
}

/**
 * Maneja el evento dragover con validaciones
 */
export const handleDragOver = (
  event: React.DragEvent,
  onEnter?: () => void
): void => {
  event.preventDefault()
  event.stopPropagation()
  event.dataTransfer.dropEffect = 'move'
  onEnter?.()
}

/**
 * Maneja el evento dragleave
 */
export const handleDragLeave = (
  event: React.DragEvent,
  onLeave?: () => void
): void => {
  event.preventDefault()
  event.stopPropagation()
  onLeave?.()
}

/**
 * Maneja el evento drop con soporte a promesas
 */
export const handleDrop = async (
  event: React.DragEvent,
  onDrop: (dataTransfer: DataTransfer) => Promise<void>,
  onFinally?: () => void
): Promise<void> => {
  event.preventDefault()
  event.stopPropagation()

  try {
    await onDrop(event.dataTransfer)
  } catch (error) {
    console.error('Error en operación de drop:', error)
  } finally {
    onFinally?.()
  }
}

/**
 * Crear un contexto para drag and drop con soporte a tipos
 */
export interface DragContext<T> {
  draggedItem: T | null
  draggedFromId: string | null
  setDraggedItem: (item: T | null, sourceId: string | null) => void
  clearDraggedItem: () => void
}

export const createDragContext = <T,>(): DragContext<T> => {
  let draggedItem: T | null = null
  let draggedFromId: string | null = null

  return {
    draggedItem,
    draggedFromId,
    setDraggedItem: (item: T | null, sourceId: string | null) => {
      draggedItem = item
      draggedFromId = sourceId
    },
    clearDraggedItem: () => {
      draggedItem = null
      draggedFromId = null
    },
  }
}

/**
 * Hook utility para validar y ejecutar operaciones de drop de forma segura
 */
export const useDropOperation = () => {
  const executeDropOperation = async <T,>(
    item: T | null,
    sourceId: string | null,
    targetId: string,
    operation: (item: T, sourceId: string, targetId: string) => Promise<void>
  ): Promise<boolean> => {
    if (!item || !sourceId) {
      return false
    }

    try {
      await operation(item, sourceId, targetId)
      return true
    } catch (error) {
      console.error('Error en operación de drop:', error)
      return false
    }
  }

  return { executeDropOperation }
}
