import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { User } from '../models/User.model'

/**
 * @swagger
 * /api/users/search:
 *   get:
 *     summary: Search users by email
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
export const searchUserByEmail = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { email } = req.query
    const user = await User.findOne({ email }).select('_id name email')

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      })
      return
    }

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to search user',
    })
  }
}
