import { validateRequest } from '../../src/middleware/validation'
import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'

describe('Validation Middleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: jest.Mock<void>

  beforeEach(() => {
    req = {
      body: {},
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    next = jest.fn()
  })

  describe('validateRequest', () => {
    it('should call next if validation passes', () => {
      const schema = z.object({
        name: z.string().min(2),
        email: z.string().email(),
      })

      req.body = {
        name: 'Test User',
        email: 'test@example.com',
      }

      const middleware = validateRequest(schema)
      middleware(req as Request, res as Response, next)

      expect(next).toHaveBeenCalled()
    })

    it('should return 400 if validation fails', () => {
      const schema = z.object({
        name: z.string().min(2),
        email: z.string().email(),
      })

      req.body = {
        name: 'T',
        email: 'invalid-email',
      }

      const middleware = validateRequest(schema)
      middleware(req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(next).not.toHaveBeenCalled()
    })

    it('should return detailed error message', () => {
      const schema = z.object({
        password: z.string().min(8),
      })

      req.body = {
        password: '123',
      }

      const middleware = validateRequest(schema)
      middleware(req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          errors: expect.any(Array),
        }),
      )
    })

    it('should validate nested objects', () => {
      const schema = z.object({
        user: z.object({
          name: z.string().min(2),
          email: z.string().email(),
        }),
      })

      req.body = {
        user: {
          name: 'Valid Name',
          email: 'valid@example.com',
        },
      }

      const middleware = validateRequest(schema)
      middleware(req as Request, res as Response, next)

      expect(next).toHaveBeenCalled()
    })

    it('should handle missing required fields', () => {
      const schema = z.object({
        name: z.string().min(2),
        email: z.string().email(),
      })

      req.body = {
        name: 'Test User',
      }

      const middleware = validateRequest(schema)
      middleware(req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(400)
    })
  })
})
