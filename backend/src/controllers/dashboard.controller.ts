import { Response } from 'express'
import { dashboardService } from '../services/dashboard.service'
import { AuthRequest } from '../middleware/auth'

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get user dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     projects:
 *                       type: object
 *                       properties:
 *                         owned:
 *                           type: number
 *                         collaborating:
 *                           type: number
 *                         total:
 *                           type: number
 *                     tasks:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: number
 *                         assigned:
 *                           type: number
 *                         byStatus:
 *                           type: object
 *                         byPriority:
 *                           type: object
 *       401:
 *         description: Unauthorized
 */
export const getStats = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!._id
    const stats = await dashboardService.getUserStats(userId)
    res.status(200).json({
      success: true,
      data: stats,
    })
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to fetch statistics',
    })
  }
}
