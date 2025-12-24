import { Router } from 'express'
import * as authController from '../controllers/auth.controller'
import { validate } from '../middleware/validation'
import { authenticate } from '../middleware/auth'
import { registerSchema, loginSchema } from '../schemas/auth.schema'

const router = Router()

router.post('/register', validate(registerSchema), authController.register)
router.post('/login', validate(loginSchema), authController.login)
router.get('/profile', authenticate, authController.getProfile)
router.post('/logout', authenticate, authController.logout)

export default router
