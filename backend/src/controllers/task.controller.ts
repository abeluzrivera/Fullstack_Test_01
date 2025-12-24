import { Response } from 'express'
import { taskService } from '../services/task.service'
import { AuthRequest } from '../middleware/auth'

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskRequest'
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Validation error
 */
export const createTask = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!._id
    const task = await taskService.createTask(userId, req.body)
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    })
  } catch (error: unknown) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create task',
    })
  }
}

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all accessible tasks with filters
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: project
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pendiente, en progreso, completada]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [baja, media, alta]
 *       - in: query
 *         name: assignedTo
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 */
export const getTasks = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!._id
    const filters = {
      project: req.query.project as string | undefined,
      status: req.query.status as string | undefined,
      priority: req.query.priority as string | undefined,
      assignedTo: req.query.assignedTo as string | undefined,
      sort: req.query.sort as string | undefined,
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    }

    const result = await taskService.getTasks(userId, filters)
    res.status(200).json({
      success: true,
      data: result.tasks,
      pagination: result.pagination,
    })
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch tasks',
    })
  }
}

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *       404:
 *         description: Task not found
 */
export const getTaskById = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!._id
    const task = await taskService.getTaskById(req.params.id, userId)
    res.status(200).json({
      success: true,
      data: task,
    })
  } catch (error: unknown) {
    res
      .status(
        error instanceof Error && error.message === 'Task not found'
          ? 404
          : 403,
      )
      .json({
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to fetch task',
      })
  }
}

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskRequest'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       403:
 *         description: Access denied
 */
export const updateTask = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!._id
    const task = await taskService.updateTask(req.params.id, userId, req.body)
    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    })
  } catch (error: unknown) {
    res
      .status(
        error instanceof Error && error.message === 'Task not found'
          ? 404
          : 403,
      )
      .json({
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to update task',
      })
  }
}

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       403:
 *         description: Access denied
 */
export const deleteTask = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!._id
    const result = await taskService.deleteTask(req.params.id, userId)
    res.status(200).json({
      success: true,
      message: result.message,
    })
  } catch (error: unknown) {
    res
      .status(
        error instanceof Error && error.message === 'Task not found'
          ? 404
          : 403,
      )
      .json({
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to delete task',
      })
  }
}
