import { Router } from 'express'
import { authenticateEntra } from '../middleware/entra-auth'
import { entraAuthService } from '../services/entra-auth.service'
import { EntraAuthRequest } from '../middleware/entra-auth'
import { Response } from 'express'

const router = Router()

/**
 * @swagger
 * /api/auth/entra/profile:
 *   get:
 *     summary: Get authenticated user profile (Entra ID)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/entra/profile',
  authenticateEntra,
  async (req: EntraAuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        })
        return
      }

      const profile = await entraAuthService.getProfile(req.user._id)

      res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: profile,
      })
    } catch (error: unknown) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch profile',
      })
    }
  },
)

/**
 * @swagger
 * /api/auth/entra/profile:
 *   put:
 *     summary: Update user profile (Entra ID)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 80
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/entra/profile',
  authenticateEntra,
  async (req: EntraAuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        })
        return
      }

      const { name } = req.body

      // Validar que name sea válido
      if (name && (typeof name !== 'string' || name.length < 2 || name.length > 80)) {
        res.status(400).json({
          success: false,
          message: 'Name must be between 2 and 80 characters',
        })
        return
      }

      const updatedProfile = await entraAuthService.updateProfile(req.user._id, { name })

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedProfile,
      })
    } catch (error: unknown) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update profile',
      })
    }
  },
)

/**
 * @swagger
 * /api/auth/entra/logout:
 *   post:
 *     summary: Logout user (Entra ID)
 *     tags: [Auth]
 *     description: Invalida la sesión del usuario. El frontend debe eliminar el token de localStorage
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post(
  '/entra/logout',
  authenticateEntra,
  async (req: EntraAuthRequest, res: Response): Promise<void> => {
    try {
      // En Entra ID, el logout se maneja en el frontend
      // Esta ruta existe para consistencia y para poder hacer auditoría si es necesario

      res.status(200).json({
        success: true,
        message: 'Logged out successfully. Please clear your token from storage.',
      })
    } catch (error: unknown) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Logout failed',
      })
    }
  },
)

/**
 * @swagger
 * /api/auth/entra/validate-token:
 *   post:
 *     summary: Validate Entra ID token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *       401:
 *         description: Token is invalid or expired
 */
router.post(
  '/entra/validate-token',
  authenticateEntra,
  async (req: EntraAuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user || !req.entraToken) {
        res.status(401).json({
          success: false,
          message: 'Invalid token',
        })
        return
      }

      res.status(200).json({
        success: true,
        message: 'Token is valid',
        data: {
          user: req.user,
          expiresAt: req.entraToken.exp ? new Date(req.entraToken.exp * 1000) : null,
        },
      })
    } catch (error: unknown) {
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'Token validation failed',
      })
    }
  },
)

export default router
