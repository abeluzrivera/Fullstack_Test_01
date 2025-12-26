import { Request, Response, NextFunction } from 'express'
import { authenticate } from '../../src/middleware/auth'
import { User } from '../../src/models/User.model'
import * as jwtUtils from '../../src/utils/jwt'

jest.mock('../../src/models/User.model')
jest.mock('../../src/utils/jwt')

describe('Auth Middleware', () => {
  let req: Partial<Request> & { user?: any }
  let res: Partial<Response>
  let next: jest.Mock<void>

  beforeEach(() => {
    req = {
      headers: {},
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    next = jest.fn()
  })

  describe('authenticate', () => {
    it('should call next if valid token is provided', async () => {
      const mockUser = {
        _id: '123',
        name: 'Test User',
        email: 'test@example.com',
      }

      req.headers = {
        authorization: 'Bearer validtoken123',
      }

      ;(jwtUtils.verifyToken as jest.Mock).mockReturnValueOnce({ userId: '123' })
      ;(User.findById as jest.Mock).mockResolvedValueOnce(mockUser)
      req.user = mockUser

      await authenticate(req as Request, res as Response, next)
      expect(next).toHaveBeenCalled()
    })

    it('should return 401 if no token is provided', async () => {
      req.headers = {}

      await authenticate(req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(next).not.toHaveBeenCalled()
    })

    it('should return 401 if token is invalid', async () => {
      req.headers = {
        authorization: 'Bearer invalidtoken',
      }
      ;(jwtUtils.verifyToken as jest.Mock).mockImplementation(() => { throw new Error('Invalid token') })

      await authenticate(req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(next).not.toHaveBeenCalled()
    })

    it('should return 401 if Bearer prefix is missing', async () => {
      req.headers = {
        authorization: 'invalidtoken',
      }

      await authenticate(req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(next).not.toHaveBeenCalled()
    })
  })
})