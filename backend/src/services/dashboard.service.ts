import mongoose from 'mongoose'
import { Project } from '../models/Project.model'
import { Task } from '../models/Task.model'

class DashboardService {
  async getUserStats(userId: string) {
    const [ownedProjects, collaboratingProjects, allTasks] = await Promise.all([
      Project.countDocuments({ owner: userId }),
      Project.countDocuments({ collaborators: userId }),
      this.getAccessibleProjectIds(userId),
    ])

    const projectIds = allTasks
    const objectIds = projectIds.map((id) => new mongoose.Types.ObjectId(id))

    const [totalTasks, tasksByStatus, tasksByPriority, recentTasks] =
      await Promise.all([
        Task.countDocuments({
          project: { $in: objectIds },
          status: { $in: ['pendiente', 'en progreso'] },
        }),
        this.getTasksByStatus(projectIds),
        this.getTasksByPriority(projectIds),
        Task.find({ project: { $in: objectIds } })
          .sort({ createdAt: -1 })
          .limit(5)
          .populate('project', 'name')
          .populate('assignedTo', 'name email'),
      ])

    const myTasks = await Task.countDocuments({
      project: { $in: objectIds },
      assignedTo: userId,
    })

    return {
      projects: {
        owned: ownedProjects,
        collaborating: collaboratingProjects,
        total: ownedProjects + collaboratingProjects,
      },
      tasks: {
        total: totalTasks,
        assigned: myTasks,
        byStatus: tasksByStatus,
        byPriority: tasksByPriority,
      },
      recentTasks,
    }
  }

  private async getTasksByStatus(projectIds: string[]) {
    const mongoose = await import('mongoose')
    const objectIds = projectIds.map((id) => new mongoose.Types.ObjectId(id))

    const result = await Task.aggregate([
      { $match: { project: { $in: objectIds } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ])

    return {
      pendiente: result.find((r) => r._id === 'pendiente')?.count || 0,
      'en progreso': result.find((r) => r._id === 'en progreso')?.count || 0,
      completada: result.find((r) => r._id === 'completada')?.count || 0,
    }
  }

  private async getTasksByPriority(projectIds: string[]) {
    const mongoose = await import('mongoose')
    const objectIds = projectIds.map((id) => new mongoose.Types.ObjectId(id))

    const result = await Task.aggregate([
      { $match: { project: { $in: objectIds } } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ])

    return {
      baja: result.find((r) => r._id === 'baja')?.count || 0,
      media: result.find((r) => r._id === 'media')?.count || 0,
      alta: result.find((r) => r._id === 'alta')?.count || 0,
    }
  }

  private async getAccessibleProjectIds(userId: string): Promise<string[]> {
    const projects = await Project.find({
      $or: [{ owner: userId }, { collaborators: userId }],
    }).select('_id')

    return projects.map((p) => p._id.toString())
  }
}

export const dashboardService = new DashboardService()
