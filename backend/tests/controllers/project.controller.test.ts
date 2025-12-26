import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { Project } from '../../src/models/Project.model'
import { projectService } from '../../src/services/project.service'
import { createProject, getProjects } from '../../src/controllers/project.controller'

jest.mock('../../src/models/Project.model')
jest.mock('../../src/services/project.service')

describe('Project Controller', () => {
  let req: Partial<Request> & { user?: any }
  let res: Partial<Response>

  beforeEach(() => {
    req = {
      user: {
        _id: new mongoose.Types.ObjectId().toString(),
      },
      body: {},
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  describe('createProject', () => {
    it('should create a new project successfully', async () => {
      req.body = {
        name: 'New Project',
        description: 'Test project description',
      }

      const mockProject = {
        _id: new mongoose.Types.ObjectId(),
        name: 'New Project',
        description: 'Test project description',
        owner: req.user?._id,
        collaborators: [],
      }

      ;(projectService.createProject as jest.Mock).mockResolvedValue(mockProject)

      await createProject(req as Request, res as Response)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            name: 'New Project',
          }),
        }),
      )
    })

    it('should return error if project name is too short', async () => {
      req.body = {
        name: 'New',
        description: 'Test',
      }
      const error = new Error('Project name too short')
      const createSpy = jest.spyOn(projectService, 'createProject').mockRejectedValue(error)
      await createProject(req as Request, res as Response)
      expect(res.status).toHaveBeenCalledWith(400)
      createSpy.mockRestore()
    })

    it('should return error if user is not authenticated', async () => {
      req.user = undefined
      req.body = {
        name: 'New Project',
        description: 'Test',
      }
      const error = new Error('User not authenticated')
      const createSpy = jest.spyOn(projectService, 'createProject').mockRejectedValue(error)
      await createProject(req as Request, res as Response)
      expect(res.status).toHaveBeenCalledWith(400)
      createSpy.mockRestore()
    })
  })

  describe('getProjects', () => {
    it('should return projects for authenticated user', async () => {
      const mockResult = {
        projects: [
          {
            _id: new mongoose.Types.ObjectId(),
            name: 'Project 1',
            owner: { _id: req.user?._id, name: 'User 1', email: 'user1@example.com' },
            collaborators: [
              { _id: new mongoose.Types.ObjectId(), name: 'User 2', email: 'user2@example.com' },
            ],
          },
          {
            _id: new mongoose.Types.ObjectId(),
            name: 'Project 2',
            owner: { _id: req.user?._id, name: 'User 1', email: 'user1@example.com' },
            collaborators: [],
          },
        ],
        pagination: { page: 1, limit: 10, total: 2 },
      }
      ;(projectService.getProjects as jest.Mock).mockResolvedValue(mockResult)

      await getProjects(req as Request, res as Response)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockResult.projects,
          pagination: mockResult.pagination,
        }),
      )
    })

    it('should return empty array if user has no projects', async () => {
      const mockResult = {
        projects: [],
        pagination: { page: 1, limit: 10, total: 0 },
      }
      ;(projectService.getProjects as jest.Mock).mockResolvedValue(mockResult)
      await getProjects(req as Request, res as Response)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: [],
          pagination: mockResult.pagination,
        }),
      )
    })

    it('should return projects with complete owner and collaborators data', async () => {
      ;(projectService.getProjects as jest.Mock).mockResolvedValueOnce({
        projects: [
          {
            _id: 'project1',
            name: 'Project 1',
            owner: { _id: 'user1', name: 'User 1', email: 'user1@example.com' },
            collaborators: [
              { _id: 'user2', name: 'User 2', email: 'user2@example.com' },
            ],
          },
        ],
        pagination: { page: 1, limit: 10, total: 1 },
      })
      req.user = { _id: 'user1', name: 'User 1', email: 'user1@example.com' }

      await getProjects(req as Request, res as Response)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: [
            expect.objectContaining({
              _id: 'project1',
              name: 'Project 1',
              owner: expect.objectContaining({
                _id: 'user1',
                name: 'User 1',
                email: 'user1@example.com',
              }),
              collaborators: [
                expect.objectContaining({
                  _id: 'user2',
                  name: 'User 2',
                  email: 'user2@example.com',
                }),
              ],
            }),
          ],
          pagination: expect.objectContaining({
            page: 1,
            limit: 10,
            total: 1,
          }),
        }),
      )
    })
  })
})
