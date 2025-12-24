import mongoose, { Document, Schema } from 'mongoose'

export enum TaskStatus {
  PENDIENTE = 'pendiente',
  EN_PROGRESO = 'en progreso',
  COMPLETADA = 'completada',
}

export enum TaskPriority {
  BAJA = 'baja',
  MEDIA = 'media',
  ALTA = 'alta',
}

export interface ITask extends Document {
  title: string
  description?: string
  project: mongoose.Types.ObjectId
  assignedTo?: mongoose.Types.ObjectId
  status: TaskStatus
  priority: TaskPriority
  createdAt: Date
  updatedAt: Date
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [5, 'Task title must be at least 5 characters'],
      maxlength: [120, 'Task title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project is required'],
      index: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.PENDIENTE,
      index: true,
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.MEDIA,
      index: true,
    },
  },
  {
    timestamps: true,
  },
)

taskSchema.index({ project: 1, status: 1 })
taskSchema.index({ project: 1, priority: 1 })
taskSchema.index({ assignedTo: 1, status: 1 })
taskSchema.index({ createdAt: -1 })

export const Task = mongoose.model<ITask>('Task', taskSchema)
