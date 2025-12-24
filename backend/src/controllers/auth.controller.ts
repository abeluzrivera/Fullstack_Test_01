import { Request, Response } from 'express'
import { authService } from '../services/auth.service'
import { AuthRequest } from '../middleware/auth'


export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await authService.register(req.body)
    res.status(201).json({
      success: true,
      message: 'User successfully registered',
      data: result,
    })
  } catch (error: unknown) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Registration failed',
    })
  }
}

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await authService.login(req.body)
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    })
  } catch (error: unknown) {
    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : 'Login failed',
    })
  }
}

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get authenticated user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const getProfile = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!._id
    const user = await authService.getProfile(userId)
    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error: unknown) {
    res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : 'Profile not found',
    })
  }
}

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
export const logout = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'Logout successful',
  })
}
