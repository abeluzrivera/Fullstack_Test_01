import { Router } from 'express'
import * as taskController from '../controllers/task.controller'
import { authenticate } from '../middleware/auth'
import { validate } from '../middleware/validation'
import { createTaskSchema, updateTaskSchema } from '../schemas/task.schema'

const router = Router()

router.use(authenticate)

router.post('/', validate(createTaskSchema), taskController.createTask)
router.get('/', taskController.getTasks)
router.get('/:id', taskController.getTaskById)
router.put('/:id', validate(updateTaskSchema), taskController.updateTask)
router.delete('/:id', taskController.deleteTask)

export default router
