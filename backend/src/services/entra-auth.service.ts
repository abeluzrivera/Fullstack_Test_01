import { User } from '../models/User.model'
import { EntraTokenPayload } from '../utils/entra'

/**
 * Servicio de autenticación con Azure Entra ID
 * Maneja la sincronización de usuarios entre Entra AD y BD local
 */
class EntraAuthService {
  /**
   * Sincroniza o crea un usuario basado en el token de Entra AD
   * Se llama automáticamente en el middleware de autenticación
   */
  async syncOrCreateUser(entraPayload: EntraTokenPayload): Promise<any> {
    const email = entraPayload.unique_name || entraPayload.email || entraPayload.upn

    if (!email) {
      throw new Error('Email not found in Entra token')
    }

    // Buscar usuario existente
    let user = await User.findOne({ email })

    if (!user) {
      // Crear nuevo usuario (first login)
      const name = entraPayload.name || entraPayload.given_name || email.split('@')[0]

      user = await User.create({
        email,
        name,
        oid: entraPayload.oid,
        loginProvider: 'entra-id',
      })
    } else if (user.loginProvider !== 'entra-id') {
      // Actualizar usuario existente a usar Entra ID
      user.oid = entraPayload.oid
      user.loginProvider = 'entra-id'
      user.password = undefined
      await user.save()
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      oid: user.oid,
      loginProvider: user.loginProvider,
      createdAt: user.createdAt,
    }
  }

  /**
   * Obtiene el perfil del usuario autenticado
   */
  async getProfile(userId: string) {
    const user = await User.findById(userId).select('-password')

    if (!user) {
      throw new Error('User not found')
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      oid: user.oid,
      loginProvider: user.loginProvider,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }

  /**
   * Actualiza el perfil del usuario
   * Solo permite actualizar nombre (email y oid se controlan en Entra)
   */
  async updateProfile(
    userId: string,
    updateData: { name?: string },
  ) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true },
    ).select('-password')

    if (!user) {
      throw new Error('User not found')
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      oid: user.oid,
      loginProvider: user.loginProvider,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }

  /**
   * Obtiene información del token para debugging
   * NO USAR EN PRODUCCIÓN para devolver información sensitiva
   */
  async getTokenInfo(entraPayload: EntraTokenPayload) {
    return {
      oid: entraPayload.oid,
      email: entraPayload.email,
      upn: entraPayload.upn,
      name: entraPayload.name,
      given_name: entraPayload.given_name,
      family_name: entraPayload.family_name,
      iat: entraPayload.iat,
      exp: entraPayload.exp,
    }
  }
}

export const entraAuthService = new EntraAuthService()
