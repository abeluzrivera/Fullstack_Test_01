import { Task } from '../models/Task.model'
import { Project } from '../models/Project.model'
import { CreateTaskInput, UpdateTaskInput } from '../schemas/task.schema'

class TaskService {
  async createTask(userId: string, data: CreateTaskInput) {
    const project = await Project.findById(data.project)

    if (!project) {
      throw new Error('Project not found')
    }

    if (
      project.owner.toString() !== userId &&
      !project.collaborators.some((c) => c.toString() === userId)
    ) {
      throw new Error('You do not have access to this project')
    }

    if (data.assignedTo) {
      const canAssign =
        data.assignedTo === userId ||
        project.owner.toString() === data.assignedTo ||
        project.collaborators.some((c) => c.toString() === data.assignedTo)

      if (!canAssign) {
        throw new Error('Can only assign tasks to project members')
      }
    }

    const task = await Task.create(data)

    return await task.populate([
      { path: 'project', select: 'name' },
      { path: 'assignedTo', select: 'name email' },
    ])
  }

  async getTasks(
    userId: string,
    filters: {
      project?: string
      status?: string
      priority?: string
      assignedTo?: string
      sort?: string
      page?: number
      limit?: number
    },
  ) {
    const page = filters.page || 1
    const limit = filters.limit || 10
    const skip = (page - 1) * limit

    const projectIds = await this.getAccessibleProjectIds(userId)

    const query: Record<string, unknown> = {
      project: { $in: projectIds },
    }

    if (filters.status) {
      query.status = filters.status
    }

    if (filters.priority) {
      query.priority = filters.priority
    }

    if (filters.assignedTo) {
      query.assignedTo = filters.assignedTo
    }

    if (filters.project) {
      query.project = filters.project
    }

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 }
    if (filters.sort) {
      const sortField = filters.sort.startsWith('-')
        ? filters.sort.substring(1)
        : filters.sort
      const sortOrder = filters.sort.startsWith('-') ? -1 : 1
      sortOption = { [sortField]: sortOrder }
    }

    const [tasks, total] = await Promise.all([
      Task.find(query)
        .populate('project', 'name')
        .populate('assignedTo', 'name email')
        .sort(sortOption)
        .skip(skip)
        .limit(limit),
      Task.countDocuments(query),
    ])

    return {
      tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  async getTaskById(taskId: string, userId: string) {
    const task = await Task.findById(taskId)
      .populate('project', 'name')
      .populate('assignedTo', 'name email')

    if (!task) {
      throw new Error('Task not found')
    }

    const project = await Project.findById(task.project)
    if (!project) {
      throw new Error('Associated project not found')
    }

    const hasAccess = await this.checkProjectAccess(
      userId,
      project._id.toString(),
    )
    if (!hasAccess) {
      throw new Error('Access denied')
    }

    return task
  }

  async updateTask(taskId: string, userId: string, data: UpdateTaskInput) {
    const task = await Task.findById(taskId)

    if (!task) {
      throw new Error('Task not found')
    }

    const hasAccess = await this.checkProjectAccess(
      userId,
      task.project.toString(),
    )
    if (!hasAccess) {
      throw new Error('Access denied')
    }

    if (data.assignedTo) {
      const project = await Project.findById(task.project)
      if (!project) {
        throw new Error('Project not found')
      }

      const canAssign =
        data.assignedTo === userId ||
        project.owner.toString() === data.assignedTo ||
        project.collaborators.some((c) => c.toString() === data.assignedTo)

      if (!canAssign) {
        throw new Error('Can only assign tasks to project members')
      }
    }

    return await Task.findByIdAndUpdate(taskId, data, {
      new: true,
      runValidators: true,
    }).populate([
      { path: 'project', select: 'name' },
      { path: 'assignedTo', select: 'name email' },
    ])
  }

  async deleteTask(taskId: string, userId: string) {
    const task = await Task.findById(taskId)

    if (!task) {
      throw new Error('Task not found')
    }

    if (!(await this.checkProjectAccess(userId, task.project.toString()))) {
      throw new Error('Access denied')
    }

    await Task.findByIdAndDelete(taskId)

    return { message: 'Task deleted successfully' }
  }

  private async checkProjectAccess(
    userId: string,
    projectId: string,
  ): Promise<boolean> {
    const project = await Project.findById(projectId)
    if (!project) return false

    return (
      project.owner.toString() === userId ||
      project.collaborators.some((c) => c.toString() === userId)
    )
  }

  private async getAccessibleProjectIds(userId: string): Promise<string[]> {
    const projects = await Project.find({
      $or: [{ owner: userId }, { collaborators: userId }],
    }).select('_id')

    return projects.map((p) => p._id.toString())
  }
}

export const taskService = new TaskService()
