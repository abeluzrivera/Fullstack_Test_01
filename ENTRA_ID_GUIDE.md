# 🔐 Azure Entra ID - Guía Completa

**Última actualización**: 23 de diciembre de 2025  
**Estado**: ✅ Listo para Producción

---

## 🎯 Info Crítica

```
Tenant ID:    8b178d44-6aac-48ed-9d57-103a0f30a570
Client ID:    876e4976-f604-4cb4-a2b5-cbccee8ac7b1

Usuario:      usuario1@ansofttech.net
Contraseña:   Kuqo609371
Authenticator: Microsoft Authenticator + QR

Frontend:     http://localhost:5173
Backend:      http://localhost:3000
Callback:     http://localhost:5173/auth/callback
```

---

## 🚀 5 Minutos para Iniciar

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

**Abre**: http://localhost:5173 → Login → Approve en Authenticator → ✅ Dashboard

---

## 📱 Configurar Authenticator con QR

### Descargar App
- **iOS**: [Microsoft Authenticator](https://apps.apple.com/app/microsoft-authenticator/id983156458)
- **Android**: [Microsoft Authenticator](https://play.google.com/store/apps/details?id=com.azure.authenticator)

### Obtener QR
1. [Azure Portal](https://portal.azure.com)
2. Busca: **"Entra ID"** → **"Users"** → **"usuario1"**
3. **"Authentication methods"** → Verás el QR

### Usar QR
1. Abre Microsoft Authenticator
2. Toca **"+"** (agregar cuenta)
3. **"Work or school account"**
4. **"Scan QR code"**
5. Escanea el código
6. Aprueba cuando lo pida en el navegador

---

## 🔄 Renovar Código QR

**Si no funciona, expiró o necesitas compartirlo de nuevo:**

1. Azure Portal → **"Entra ID"** → **"Users"** → **"usuario1"**
2. **"Authentication methods"**
3. Click en el ❌ de **"Microsoft Authenticator"** (en métodos no usables)
4. **"Delete"**
5. **"Add authentication method"** → **"Microsoft Authenticator"** → **"Phone sign-in"**
6. ✅ Nuevo QR generado

### Compartir QR

- **Captura de pantalla**: Screenshot del QR
- **Enlace**: Copia la URL de la página y envía
- **Código manual**: Si no funciona el QR, usa el código numérico que aparece abajo
- **SMS/Llamada**: Alterna: crea método de verificación por SMS o llamada

---

## 🔧 Recrear Entra ID desde CERO

### 1️⃣ Registrar Aplicación

1. [Azure Portal](https://portal.azure.com) → Busca **"Entra ID"**
2. **"App registrations"** → **"New registration"**
3. Rellena:
   ```
   Nombre:              fullstack-test-app
   Account types:       Multitenant ⭐
   Redirect URI type:   Single-page application (SPA)
   Redirect URI:        http://localhost:5173/auth/callback
   ```
4. **"Register"**
5. Copia:
   - **Application (client) ID** → variable `.env`
   - **Directory (tenant) ID** → variable `.env`

### 2️⃣ Configurar Authentication

1. **"Authentication"** (menú izquierdo)
2. Verifica Redirect URI: `http://localhost:5173/auth/callback`
3. **"Implicit grant and hybrid flows"**
4. ✅ **"ID tokens"**
5. ✅ **"Access tokens"**
6. **"Save"**

### 3️⃣ Configurar API Permissions

1. **"API permissions"** → **"Add a permission"**
2. **"Microsoft Graph"** → **"Delegated permissions"**
3. Busca y selecciona:
   ```
   openid
   profile
   email
   offline_access
   ```
4. **"Add permissions"**
5. **"Grant admin consent for [tu tenant]"** → **"Yes"**

### 4️⃣ Crear Usuario de Prueba

1. **"Entra ID"** → **"Users"** → **"New user"**
2. Rellena:
   ```
   Nombre:                usuario1
   Email:                 usuario1@ansofttech.net
   Password (temporal):   GeneraUnaFuerteAqui!123
   ```
3. **"Create"**
4. **Copia la contraseña temporal** y comparte
5. Usuario cambiará contraseña en primer login

### 5️⃣ Activar Authenticator para Usuario

1. **"Users"** → **"usuario1"** → **"Authentication methods"**
2. **"Add authentication method"** → **"Microsoft Authenticator"**
3. Selecciona: **"Phone sign-in"**
4. ✅ QR generado - **Comparte el QR al usuario**

---

## 🔍 Solucionar Problemas (30 segundos)

| Problema | Solución |
|---|---|
| **Login fallido** | ❌ Tenant ID / Client ID incorrectos en `.env` |
| **Authenticator no aparece** | 1. Regenera QR, 2. Recarga la página, 3. Limpia caché del navegador |
| **"Approval timed out"** | Approval toma 15 seg max - Vuelve a intentar |
| **QR expirado** | Genera nuevo QR en Azure (ver sección "Renovar Código QR") |
| **Usuario no existe** | Verifica email en Azure Portal → Users |
| **CORS error en frontend** | Backend debe permitir frontend URL en CORS |
| **JWT inválido** | Backend no obtiene JWKS de Azure - Verifica conexión internet |

---

## ⚙️ Variables de Entorno Necesarias

### Backend (`.env`)
```env
# Azure Entra ID
ENTRA_ID_TENANT_ID=8b178d44-6aac-48ed-9d57-103a0f30a570
ENTRA_ID_CLIENT_ID=876e4976-f604-4cb4-a2b5-cbccee8ac7b1

# JWT Validation
ENTRA_ID_JWKS_URI=https://login.microsoftonline.com/8b178d44-6aac-48ed-9d57-103a0f30a570/discovery/v2.0/keys

# Base de datos
MONGODB_URI=mongodb://localhost:27017/fullstack_test

# Other
JWT_SECRET=tu-secret-super-seguro-aqui
SERVER_PORT=3000
```

### Frontend (`.env`)
```env
VITE_ENTRA_ID_CLIENT_ID=876e4976-f604-4cb4-a2b5-cbccee8ac7b1
VITE_ENTRA_ID_TENANT_ID=8b178d44-6aac-48ed-9d57-103a0f30a570
VITE_ENTRA_ID_CALLBACK=http://localhost:5173/auth/callback
VITE_API_URL=http://localhost:3000
```

---

## 🔐 Flujo de Autenticación

```
1. Usuario llena email/password en Frontend
   ↓
2. Frontend llama a `/api/auth/login` con credenciales
   ↓
3. Backend valida credenciales en MongoDB
   ↓
4. Backend envía `mfaRequired: true` si está configurado
   ↓
5. Frontend muestra "Approba en Authenticator"
   ↓
6. Usuario abre Authenticator en teléfono
   ↓
7. Usuario toca "Approve" en Authenticator
   ↓
8. Frontend continúa y obtiene JWT de backend
   ↓
9. Frontend envía JWT en Authorization header: `Bearer <token>`
   ↓
10. Backend valida JWT con JWKS de Azure
    ↓
11. Usuario autenticado ✅
```

---

## 📊 Archivos Clave en Proyecto

```
Backend:
- src/config/entra.ts              ← Config Azure
- src/middleware/auth.ts           ← Valida JWT
- src/controllers/auth.controller  ← Login endpoint
- src/services/auth.service        ← Lógica autenticación

Frontend:
- src/lib/msalConfig.ts            ← Config MSAL
- src/hooks/useEntraAuth.ts        ← Hook custom auth
- src/pages/AuthPage.tsx           ← Login page
- src/store/authStore.ts           ← Auth state

Variables:
- backend/.env                     ← Credenciales backend
- frontend/.env                    ← Credenciales frontend
```

---

## ✅ Testing Rápido

### Test 1: Login Exitoso
```bash
# 1. Inicia backend y frontend
npm run dev  # en ambas carpetas

# 2. Ve a http://localhost:5173
# 3. Email: usuario1@ansofttech.net
# 4. Password: Kuqo609371
# 5. Click "Login"
# 6. Debería pedir Authenticator approval
# 7. Abre Authenticator en teléfono y aprueba
# 8. ✅ Deberías estar en /dashboard
```

### Test 2: API con JWT
```bash
# 1. Obtén JWT de login (en DevTools → Network)
# 2. Usa curl para llamar API protegida:

curl -H "Authorization: Bearer <JWT_AQUI>" \
     http://localhost:3000/api/dashboard/stats

# Response:
# {"data": {...}, "status": "success"}  ✅
```

### Test 3: Validación JWT
```bash
# Backend valida JWT automáticamente
# Si JWT es inválido: Error 401 Unauthorized
# Si JWT es válido: Acceso a recurso protegido
```

---


## 🚨 Emergencias (Última Opción)

**Si nada funciona:**

1. **Limpia todo**: 
   ```bash
   # Frontend
   rm -rf node_modules .env
   npm install
   
   # Backend
   rm -rf node_modules .env
   npm install
   ```

2. **Verifica `.env`**:
   - ¿Están correctos `TENANT_ID` y `CLIENT_ID`?
   - ¿Existe `MONGODB_URI`?

3. **Revisa Azure Portal**:
   - ¿Existe la aplicación registrada?
   - ¿Existe el usuario?
   - ¿Tiene permisos API?

4. **Prueba conexión**:
   ```bash
   curl https://login.microsoftonline.com/8b178d44-6aac-48ed-9d57-103a0f30a570/discovery/v2.0/keys
   ```

5. **Contacta soporte** con:
   - Screenshot de error
   - Logs de backend/frontend
   - Variables `.env` (sin secretos)

---

## 📞 Referencia Rápida

| Necesidad | Dónde |
|---|---|
| **Cambiar contraseña usuario** | Azure Portal → Users → usuario1 → Reset password |
| **Agregar nuevo usuario** | Azure Portal → Users → New user |
| **Cambiar QR** | Azure Portal → Users → usuario1 → Authentication methods → Delete + Add |
| **Revisar intentos de login** | Azure Portal → Sign-in logs |
| **Ver JWT** | DevTools → Network → auth/login response |
| **Documentación Microsoft** | https://learn.microsoft.com/en-us/entra/identity-platform |
