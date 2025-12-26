import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { User } from '../models/User.model'
import bcrypt from 'bcrypt'

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 */
export const getAllUsers = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const users = await User.find().select('_id name email').lean()

    res.status(200).json({
      success: true,
      data: users,
    })
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch users',
    })
  }
}

/**
 * @swagger
 * /api/users/search:
 *   get:
 *     summary: Search user by email
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

export const createUser = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'Name, email and password are required',
      })
      return
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'Email already registered',
      })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      loginProvider: 'local',
    })

    await newUser.save()

    res.status(201).json({
      success: true,
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    })
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create user',
    })
  }
}
