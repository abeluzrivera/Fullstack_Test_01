jest.mock('jsonwebtoken', () => ({
  sign: () => 'mocked.jwt.token',
  verify: (token: string) => {
    if (token === 'invalid_token' || token === 'expiredToken') throw new Error('Invalid or expired token')
    // Simula que el token es el userId para el test
    return { userId: token }
  },
}))
import mongoose from 'mongoose'
import { User } from '../../src/models/User.model'
import { generateToken, verifyToken } from '../../src/utils/jwt'

jest.mock('jsonwebtoken')

describe('Auth Service', () => {
  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const userId = new mongoose.Types.ObjectId()
      const token = generateToken(userId.toString())

      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
    })
  })

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const userId = new mongoose.Types.ObjectId()
      // Aquí el token será igual al userId para el mock
      const decoded = verifyToken(userId.toString())
      expect(decoded).toBeDefined()
      expect(decoded.userId).toBe(userId.toString())
    })

    it('should throw error for invalid token', () => {
      expect(() => {
        verifyToken('invalid_token')
      }).toThrow()
    })

    it('should throw error for expired token', () => {
      expect(() => {
        verifyToken('expiredToken')
      }).toThrow()
    })
  })
})
