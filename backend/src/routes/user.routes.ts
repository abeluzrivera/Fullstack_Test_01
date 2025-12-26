import { Router } from 'express'
import { getAllUsers, searchUserByEmail, createUser } from '../controllers/user.controller'
import { authenticate } from '../middleware/auth'

const router = Router()

router.use(authenticate)

router.get('/', getAllUsers)
router.post('/', createUser)

export default router
