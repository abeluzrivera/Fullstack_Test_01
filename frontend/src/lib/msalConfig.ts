import { PublicClientApplication, BrowserCacheLocation } from '@azure/msal-browser'
import type { Configuration } from '@azure/msal-browser'

/**
 * Configuración de MSAL para Azure Entra ID
 * Usa Authorization Code Flow con PKCE (recomendado para SPAs)
 */

const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID || 'your-client-id',
    authority: import.meta.env.VITE_AZURE_AUTHORITY || 'https://login.microsoftonline.com/common',
    redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI || 'http://localhost:7898/auth/callback',
    postLogoutRedirectUri: import.meta.env.VITE_AZURE_LOGOUT_REDIRECT_URI || 'http://localhost:7898/',
    navigateToLoginRequestUrl: true,
  },
  cache: {
    // Usar sessionStorage para mayor seguridad que localStorage
    // Los tokens se limpian al cerrar la pestaña
    cacheLocation: BrowserCacheLocation.SessionStorage,
    storeAuthStateInCookie: true, // Para compatibilidad con navegadores
  },
  system: {
    loggerOptions: {
      loggerCallback: (_level, message, containsPii) => {
        if (containsPii) {
          return
        }
        console.log(message)
      },
      piiLoggingEnabled: false,
    },
  },
}

/**
 * Scopes para login básico (perfil del usuario)
 * Scopes de OpenID Connect - no requieren Expose an API configurado
 */
export const apiScopes = [
  'openid',
  'profile', 
  'email',
]

/**
 * Crear instancia de PublicClientApplication
 * Se inicializa una vez y se reutiliza en toda la app
 */
let msalInstance: PublicClientApplication | null = null

export function getMsalInstance(): PublicClientApplication {
  if (!msalInstance) {
    msalInstance = new PublicClientApplication(msalConfig)
  }
  return msalInstance
}

/**
 * Función para extraer datos del token ID de Entra
 */
export interface EntraUserInfo {
  oid?: string
  email?: string
  name?: string
  givenName?: string
  familyName?: string
}

export function extractUserInfoFromIdToken(idToken: string): EntraUserInfo {
  try {
    // Decodificar el JWT (ignorar validación de firma en cliente)
    const parts = idToken.split('.')
    const decoded = JSON.parse(atob(parts[1]))

    return {
      oid: decoded.oid,
      email: decoded.email || decoded.unique_name,
      name: decoded.name,
      givenName: decoded.given_name,
      familyName: decoded.family_name,
    }
  } catch (error) {
    console.error('Error decoding token:', error)
    return {}
  }
}
