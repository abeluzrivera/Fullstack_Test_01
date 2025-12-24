import { Router } from 'express'
import * as projectController from '../controllers/project.controller'
import { authenticate } from '../middleware/auth'
import { validate } from '../middleware/validation'
import {
  createProjectSchema,
  updateProjectSchema,
  addCollaboratorSchema,
} from '../schemas/project.schema'

const router = Router()

router.use(authenticate)

router.post('/', validate(createProjectSchema), projectController.createProject)
router.get('/', projectController.getProjects)
router.get('/:id', projectController.getProjectById)
router.put(
  '/:id',
  validate(updateProjectSchema),
  projectController.updateProject,
)
router.delete('/:id', projectController.deleteProject)
router.post(
  '/:id/collaborators',
  validate(addCollaboratorSchema),
  projectController.addCollaborator,
)
router.delete(
  '/:id/collaborators/:userId',
  projectController.removeCollaborator,
)

export default router
