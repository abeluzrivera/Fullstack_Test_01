import { Router } from 'express'
import { searchUserByEmail } from '../controllers/user.controller'
import { authenticate } from '../middleware/auth'

const router = Router()

router.use(authenticate)

router.get('/search', searchUserByEmail)

export default router
