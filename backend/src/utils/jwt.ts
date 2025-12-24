import jwt, { JwtPayload } from 'jsonwebtoken'
import type { StringValue } from 'ms'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN as StringValue) || '7d'

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  })
}

export const verifyToken = (token: string): { userId: string } => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    return { userId: decoded.userId }
  } catch {
    throw new Error('Invalid or expired token')
  }
}
