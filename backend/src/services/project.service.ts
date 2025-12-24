import mongoose from 'mongoose'
import { Project } from '../models/Project.model'
import {
  CreateProjectInput,
  UpdateProjectInput,
} from '../schemas/project.schema'

class ProjectService {
  private async validateProjectOwnership(projectId: string, userId: string) {
    const project = await Project.findById(projectId)
    if (!project) throw new Error('Project not found')
    if (project.owner.toString() !== userId) {
      throw new Error('Only the project owner can perform this action')
    }
    return project
  }

  async createProject(userId: string, data: CreateProjectInput) {
    const project = await Project.create({
      ...data,
      owner: userId,
      collaborators: [],
    })

    return await project.populate('owner', 'name email')
  }

  async getProjects(userId: string, page = 1, limit = 10, search?: string) {
    const skip = (page - 1) * limit

    const query: Record<string, unknown> = {
      $or: [{ owner: userId }, { collaborators: userId }],
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' }
    }

    const [projects, total] = await Promise.all([
      Project.find(query)
        .populate('owner', 'name email')
        .populate('collaborators', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Project.countDocuments(query),
    ])

    return {
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  async getProjectById(projectId: string, userId: string) {
    const project = await Project.findById(projectId)
      .populate('owner', 'name email')
      .populate('collaborators', 'name email')

    if (!project) {
      throw new Error('Project not found')
    }

    if (
      project.owner._id.toString() !== userId &&
      !project.collaborators.some(
        (c: mongoose.Types.ObjectId) => c._id.toString() === userId,
      )
    ) {
      throw new Error('Access denied')
    }

    return project
  }

  async updateProject(
    projectId: string,
    userId: string,
    data: UpdateProjectInput,
  ) {
    await this.validateProjectOwnership(projectId, userId)

    return await Project.findByIdAndUpdate(projectId, data, {
      new: true,
      runValidators: true,
    }).populate('owner', 'name email')
  }

  async deleteProject(projectId: string, userId: string) {
    await this.validateProjectOwnership(projectId, userId)

    await Project.findByIdAndDelete(projectId)

    return { message: 'Project deleted successfully' }
  }

  async addCollaborator(
    projectId: string,
    userId: string,
    collaboratorId: string,
  ) {
    const project = await this.validateProjectOwnership(projectId, userId)

    if (
      project.owner.toString() === collaboratorId ||
      project.collaborators.some((c) => c.toString() === collaboratorId)
    ) {
      throw new Error('User is already part of the project')
    }

    return await Project.findByIdAndUpdate(
      projectId,
      { $addToSet: { collaborators: collaboratorId } },
      { new: true, runValidators: true },
    ).populate('collaborators', 'name email')
  }

  async removeCollaborator(
    projectId: string,
    userId: string,
    collaboratorId: string,
  ) {
    await this.validateProjectOwnership(projectId, userId)

    return await Project.findByIdAndUpdate(
      projectId,
      { $pull: { collaborators: collaboratorId } },
      { new: true },
    ).populate('collaborators', 'name email')
  }
}

export const projectService = new ProjectService()
