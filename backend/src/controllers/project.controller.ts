import { Response } from 'express'
import { projectService } from '../services/project.service'
import { AuthRequest } from '../middleware/auth'

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProjectRequest'
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Project'
 *       401:
 *         description: Unauthorized
 */
export const createProject = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!._id
    const project = await projectService.createProject(userId, req.body)
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    })
  } catch (error: unknown) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to create project',
    })
  }
}

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects (owned or collaborating)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by project name
 *     responses:
 *       200:
 *         description: Projects retrieved successfully
 */
export const getProjects = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!._id
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const search = req.query.search as string

    const result = await projectService.getProjects(userId, page, limit, search)
    res.status(200).json({
      success: true,
      data: result.projects,
      pagination: result.pagination,
    })
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to fetch projects',
    })
  }
}

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Projects]
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
 *         description: Project retrieved successfully
 *       404:
 *         description: Project not found
 */
export const getProjectById = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!._id
    const project = await projectService.getProjectById(req.params.id, userId)
    res.status(200).json({
      success: true,
      data: project,
    })
  } catch (error: unknown) {
    res
      .status(
        error instanceof Error && error.message === 'Project not found'
          ? 404
          : 403,
      )
      .json({
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to fetch project',
      })
  }
}

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update project
 *     tags: [Projects]
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
 *             $ref: '#/components/schemas/UpdateProjectRequest'
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       403:
 *         description: Only owner can update
 */
export const updateProject = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!._id
    const project = await projectService.updateProject(
      req.params.id,
      userId,
      req.body,
    )
    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    })
  } catch (error: unknown) {
    res
      .status(
        error instanceof Error && error.message.includes('owner') ? 403 : 404,
      )
      .json({
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to update project',
      })
  }
}

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Project deleted successfully
 *       404:
 *         description: Project not found
 */
export const deleteProject = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!._id
    await projectService.deleteProject(req.params.id, userId)
    res.status(204).send()
  } catch (error: unknown) {
    res
      .status(
        error instanceof Error && error.message.includes('owner') ? 403 : 404,
      )
      .json({
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to delete project',
      })
  }
}

/**
 * @swagger
 * /api/projects/{id}/collaborators:
 *   post:
 *     summary: Add collaborator to project
 *     tags: [Projects]
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
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Collaborator added successfully
 */
export const addCollaborator = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!._id
    const project = await projectService.addCollaborator(
      req.params.id,
      userId,
      req.body.userId,
    )
    res.status(200).json({
      success: true,
      message: 'Collaborator added successfully',
      data: project,
    })
  } catch (error: unknown) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to add collaborator',
    })
  }
}

/**
 * @swagger
 * /api/projects/{id}/collaborators/{userId}:
 *   delete:
 *     summary: Remove collaborator from project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Collaborator removed successfully
 */
export const removeCollaborator = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!._id
    const project = await projectService.removeCollaborator(
      req.params.id,
      userId,
      req.params.userId,
    )
    res.status(200).json({
      success: true,
      message: 'Collaborator removed successfully',
      data: project,
    })
  } catch (error: unknown) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to remove collaborator',
    })
  }
}
