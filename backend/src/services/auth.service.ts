import { User } from '../models/User.model'
import { generateToken } from '../utils/jwt'
import { RegisterInput, LoginInput } from '../schemas/auth.schema'

class AuthService {
  async register(data: RegisterInput) {
    const existingUser = await User.findOne({ email: data.email })

    if (existingUser) {
      throw new Error('Email already in use')
    }

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: data.password,
    })

    const token = generateToken(user._id.toString())

    return {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    }
  }

  async login(data: LoginInput) {
    const user = await User.findOne({ email: data.email }).select('+password')

    if (!user) {
      throw new Error('Invalid email or password')
    }

    const isPasswordValid = await user.comparePassword(data.password)

    if (!isPasswordValid) {
      throw new Error('Invalid email or password')
    }

    const token = generateToken(user._id.toString())

    return {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    }
  }

  async getProfile(userId: string) {
    const user = await User.findById(userId).select('-password')

    if (!user) {
      throw new Error('User not found')
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}

export const authService = new AuthService()
