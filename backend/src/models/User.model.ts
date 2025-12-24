import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import console from 'console'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      maxlength: [30, 'Password cannot exceed 30 characters'],
      select: false,
    },
  },
  {
    timestamps: true,
  },
)

userSchema.pre('save', async function (): Promise<void> {
  if (!this.isModified('password')) return

  try {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(this.password, salt)

    this.password = hash
  } catch (error: unknown) {
    console.error('Error hashing password:', error)
    throw error
  }
})

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password)
  } catch (error: unknown) {
    console.error('Error comparing password:', error)
    throw error
  }
}

export const User = mongoose.model<IUser>('User', userSchema)
