/**
 * Azure Entra ID Configuration
 * Configuración segura de Azure Entra ID para validación de tokens
 */

export const entraConfig = {
  tenantId: process.env.AZURE_TENANT_ID || '8b178d44-6aac-48ed-9d57-103a0f30a570',
  clientId: process.env.AZURE_CLIENT_ID || '876e4976-f604-4cb4-a2b5-cbccee8ac7b1',
  clientSecret: process.env.AZURE_CLIENT_SECRET,
  authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID || '8b178d44-6aac-48ed-9d57-103a0f30a570'}/v2.0`,
  jwksUri: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID || '8b178d44-6aac-48ed-9d57-103a0f30a570'}/discovery/v2.0/keys`,
  scopes: ['api://876e4976-f604-4cb4-a2b5-cbccee8ac7b1/.default'],
  redirectUri: process.env.AZURE_REDIRECT_URI || 'http://localhost:5173/auth/callback',
}

export const jwtConfig = {
  issuer: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID || '8b178d44-6aac-48ed-9d57-103a0f30a570'}/v2.0`,
  audience: process.env.AZURE_CLIENT_ID || '876e4976-f604-4cb4-a2b5-cbccee8ac7b1',
  algorithms: ['RS256'],
}
