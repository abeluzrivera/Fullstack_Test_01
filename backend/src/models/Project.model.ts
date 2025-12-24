import mongoose, { Document, Schema } from 'mongoose'

export interface IProject extends Document {
  name: string
  description?: string
  owner: mongoose.Types.ObjectId
  collaborators: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      minlength: [5, 'Project name must be at least 5 characters'],
      maxlength: [80, 'Project name cannot exceed 80 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Project owner is required'],
      index: true,
    },
    collaborators: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  },
)

projectSchema.index({ owner: 1, createdAt: -1 })
projectSchema.index({ collaborators: 1 })

projectSchema.pre('save', async function (): Promise<void> {
  if (this.collaborators && this.collaborators.length > 0) {
    this.collaborators = this.collaborators.filter(
      (collaborator) => !collaborator.equals(this.owner),
    )
  }
})

export const Project = mongoose.model<IProject>('Project', projectSchema)
