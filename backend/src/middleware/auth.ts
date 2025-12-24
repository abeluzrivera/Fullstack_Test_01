import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'
import { User } from '../models/User.model'

export interface AuthRequest extends Request {
  user?: {
    _id: string
    name: string
    email: string
  }
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'No token provided. Authorization required.',
      })
      return
    }

    const token = authHeader.substring(7)

    const decoded = verifyToken(token)

    const user = await User.findById(decoded.userId).select('-password')

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not found. Invalid token.',
      })
      return
    }

    req.user = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
    }

    next()
  } catch (error: unknown) {
    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : 'Authentication failed',
    })
  }
}
