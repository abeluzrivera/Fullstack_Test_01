import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { taskService } from '../../src/services/task.service'
import { createTask, updateTask, deleteTask } from '../../src/controllers/task.controller'

jest.mock('../../src/services/task.service')

describe('Task Controller', () => {
  let req: Partial<Request> & { user?: any }
  let res: Partial<Response>

  beforeEach(() => {
    req = {
      user: {
        _id: new mongoose.Types.ObjectId().toString(),
      },
      body: {},
      params: {},
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  describe('createTask', () => {
    it('should create a new task successfully', async () => {
      req.body = {
        title: 'Test Task',
        description: 'Task description',
        project: new mongoose.Types.ObjectId().toString(),
        priority: 'media',
      }

      const mockTask = {
        _id: new mongoose.Types.ObjectId(),
        title: 'Test Task',
        description: 'Task description',
        project: req.body.project,
        status: 'pendiente',
        priority: 'media',
      }

      ;(taskService.createTask as jest.Mock).mockResolvedValue(mockTask)

      await createTask(req as Request, res as Response)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            title: 'Test Task',
          }),
        }),
      )
    })

    it('should return error if title is too short', async () => {
      req.body = {
        title: 'Test',
        project: new mongoose.Types.ObjectId().toString(),
      }
      const error = new Error('Title too short')
      const createSpy = jest.spyOn(taskService, 'createTask').mockRejectedValue(error)
      await createTask(req as Request, res as Response)
      expect(res.status).toHaveBeenCalledWith(400)
      createSpy.mockRestore()
    })

    it('should return error if project is missing', async () => {
      req.body = {
        title: 'Test Task',
        description: 'Task description',
      }
      const error = new Error('Project missing')
      const createSpy = jest.spyOn(taskService, 'createTask').mockRejectedValue(error)
      await createTask(req as Request, res as Response)
      expect(res.status).toHaveBeenCalledWith(400)
      createSpy.mockRestore()
    })
  })

  describe('updateTask', () => {
    it('should update task status successfully', async () => {
      req.params = {
        id: new mongoose.Types.ObjectId().toString(),
      }
      req.body = {
        status: 'en progreso',
      }

      const mockTask = {
        _id: req.params.id,
        title: 'Test Task',
        status: 'en progreso',
      }

      ;(taskService.updateTask as jest.Mock).mockResolvedValue(mockTask)

      await updateTask(req as Request, res as Response)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            status: 'en progreso',
          }),
        }),
      )
    })

    it('should return error if task ID is invalid', async () => {
      req.params = {
        id: 'invalid-id',
      }
      req.body = {
        status: 'en progreso',
      }
      const error = new Error('Invalid task ID')
      const updateSpy = jest.spyOn(taskService, 'updateTask').mockRejectedValue(error)
      await updateTask(req as Request, res as Response)
      expect(res.status).toHaveBeenCalledWith(403)
      updateSpy.mockRestore()
    })

    it('should return error if status is invalid', async () => {
      req.params = {
        id: new mongoose.Types.ObjectId().toString(),
      }
      req.body = {
        status: 'invalid-status',
      }
      const error = new Error('Invalid status')
      const updateSpy = jest.spyOn(taskService, 'updateTask').mockRejectedValue(error)
      await updateTask(req as Request, res as Response)
      expect(res.status).toHaveBeenCalledWith(403)
      updateSpy.mockRestore()
    })

  describe('deleteTask', () => {
    it('should delete task successfully', async () => {
      req.params = {
        id: new mongoose.Types.ObjectId().toString(),
      }
      ;(taskService.deleteTask as jest.Mock).mockResolvedValue({ message: 'Task deleted successfully' })
      await deleteTask(req as Request, res as Response)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: expect.any(String),
        }),
      )
    })

    it('should return error if task ID is invalid', async () => {
      req.params = {
        id: 'invalid-id',
      }
      const error = new Error('Invalid task ID')
      const deleteSpy = jest.spyOn(taskService, 'deleteTask').mockRejectedValue(error)
      await deleteTask(req as Request, res as Response)
      expect(res.status).toHaveBeenCalledWith(403)
      deleteSpy.mockRestore()
    })

    it('should return 404 if task not found', async () => {
      req.params = {
        id: new mongoose.Types.ObjectId().toString(),
      }
      const error = new Error('Task not found')
      const deleteSpy = jest.spyOn(taskService, 'deleteTask').mockRejectedValue(error)
      await deleteTask(req as Request, res as Response)
      expect(res.status).toHaveBeenCalledWith(404)
      deleteSpy.mockRestore()
    })

    it('should return 404 if task not found', async () => {
      req.params = {
        id: new mongoose.Types.ObjectId().toString(),
      }
      ;(taskService.deleteTask as jest.Mock).mockResolvedValue(null)
      await deleteTask(req as Request, res as Response)
      expect(res.status).toHaveBeenCalledWith(404)
    })
  })
  })
})
