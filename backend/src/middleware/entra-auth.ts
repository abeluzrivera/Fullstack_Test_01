import { Request, Response, NextFunction } from 'express'
import { verifyEntraToken, extractBearerToken, EntraTokenPayload } from '../utils/entra'
import { User } from '../models/User.model'

/**
 * Interfaz extendida de Request con usuario autenticado por Entra ID
 */
export interface EntraAuthRequest extends Request {
  user?: {
    _id: string
    oid: string // Object ID de Entra AD
    email: string
    name: string
  }
  entraToken?: EntraTokenPayload
}

/**
 * Middleware de autenticación con Azure Entra ID
 * Valida el token JWT, verifica firma y audiencia
 * Auto-crea el usuario en la BD si no existe (first login)
 */
export const authenticateEntra = async (
  req: EntraAuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Extraer token del header
    const token = extractBearerToken(req.headers.authorization)

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'No token provided. Authorization required.',
      })
      return
    }

    // Verificar token de Entra ID
    const entraPayload = await verifyEntraToken(token)

    // Guardar el payload para uso posterior
    req.entraToken = entraPayload

    // Obtener email del payload
    const email = entraPayload.unique_name || entraPayload.email || entraPayload.upn

    if (!email) {
      res.status(401).json({
        success: false,
        message: 'Invalid token: missing email claim',
      })
      return
    }

    // Buscar usuario en BD por email
    let user = await User.findOne({ email })

    // Si no existe, crear automáticamente (first login)
    if (!user) {
      const name = entraPayload.name || entraPayload.given_name || email.split('@')[0]

      user = await User.create({
        email,
        name,
        oid: entraPayload.oid, // Guardar Object ID de Entra
        loginProvider: 'entra-id',
        password: undefined, // No hay contraseña
      })
    }

    // Adjuntar usuario al request
    req.user = {
      _id: user._id.toString(),
      oid: entraPayload.oid || '',
      email: user.email,
      name: user.name,
    }

    next()
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Token verification failed'

    res.status(401).json({
      success: false,
      message: `Authentication failed: ${message}`,
    })
  }
}

/**
 * Middleware opcional para permitir acceso sin token
 * Útil para rutas que pueden ser públicas u privadas
 */
export const authenticateEntraOptional = async (
  req: EntraAuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = extractBearerToken(req.headers.authorization)

    if (!token) {
      next()
      return
    }

    const entraPayload = await verifyEntraToken(token)
    req.entraToken = entraPayload

    const email = entraPayload.unique_name || entraPayload.email || entraPayload.upn

    if (email) {
      let user = await User.findOne({ email })

      if (user) {
        req.user = {
          _id: user._id.toString(),
          oid: entraPayload.oid || '',
          email: user.email,
          name: user.name,
        }
      }
    }

    next()
  } catch {
    // Ignorar errores y continuar sin autenticación
    next()
  }
}
