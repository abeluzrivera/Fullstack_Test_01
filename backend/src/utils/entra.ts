import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'
import { jwtConfig, entraConfig } from '../config/entra'

/**
 * Cliente para obtener las claves públicas de Azure Entra ID
 * Cachea las claves automáticamente
 */
const client = jwksClient({
  jwksUri: entraConfig.jwksUri,
  cacheMaxAge: 3600000, // 1 hora
  cacheMaxEntries: 10,
})

/**
 * Obtiene la clave pública para verificar el token
 */
export async function getSigningKey(header: any): Promise<string> {
  try {
    const key = await client.getSigningKey(header.kid)
    return key.getPublicKey()
  } catch (error) {
    throw new Error(`Failed to get signing key: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Interfaz para el payload del token de Entra ID
 */
export interface EntraTokenPayload extends jwt.JwtPayload {
  oid?: string // Object ID del usuario en Entra
  upn?: string // User Principal Name
  email?: string
  name?: string
  given_name?: string
  family_name?: string
  unique_name?: string
  ver?: string
  iat?: number
  exp?: number
}

/**
 * Verifica y decodifica un token JWT de Azure Entra ID
 * Realiza validación de firma, emisor y audiencia
 */
export async function verifyEntraToken(token: string): Promise<EntraTokenPayload> {
  try {
    // Decodificar sin verificar primero para obtener el header
    const decoded = jwt.decode(token, { complete: true })

    if (!decoded || !decoded.header || !decoded.payload) {
      throw new Error('Invalid token format')
    }

    // Obtener la clave pública
    const signingKey = await getSigningKey(decoded.header)

    // Verificar el token
    const verified = jwt.verify(token, signingKey, {
      algorithms: jwtConfig.algorithms as jwt.VerifyOptions['algorithms'],
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience,
    }) as EntraTokenPayload

    return verified
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error(`Token verification failed: ${error.message}`)
    }
    throw error
  }
}

/**
 * Extrae el Bearer token del header Authorization
 */
export function extractBearerToken(authHeader?: string): string | null {
  if (!authHeader) return null

  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return null
  }

  return parts[1]
}
