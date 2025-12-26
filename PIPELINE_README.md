# 🚀 Pipeline CI/CD Azure DevOps

## Descripción General

Este repositorio incluye un pipeline **completo y profesional** para automatizar la compilación, empaquetado y despliegue de la aplicación Fullstack en Azure Web App Container Registry.

```
┌─────────────────────────────────────────────────────────────┐
│                   CI/CD PIPELINE DIAGRAM                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. BUILD BACKEND ──┐                                      │
│     • npm install   │                                      │
│     • TypeScript    ├──> 3. BUILD DOCKER IMAGES           │
│     • Tests         │     • Backend image                 │
│                     │     • Frontend image                │
│  2. BUILD FRONTEND ─┤                                      │
│     • npm install   │                                      │
│     • Vite build    │                                      │
│     • Lint          │                                      │
│                                                             │
│     ┌──────────────────────┐                              │
│     │ 4. PUSH TO ACR       │                              │
│     │ • Authenticate       │                              │
│     │ • Push images        │                              │
│     └──────────────────────┘                              │
│              │                                            │
│     ┌────────┴────────┬──────────────┐                   │
│     │                 │              │                   │
│  5. DEPLOY DEV    6. DEPLOY STAGING  7. DEPLOY PROD     │
│  (develop)        (release/*)        (master)            │
│  • Auto          • Auto             • Manual approval    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Archivos Incluidos

### Archivos de Configuración

| Archivo | Descripción |
|---------|-------------|
| `azure-pipelines.yml` | Pipeline principal de Azure DevOps |
| `.azure/pipeline-variables.yml` | Variables parametrizadas del pipeline |
| `PIPELINE_SETUP.md` | Guía detallada de configuración |
| `setup-pipeline.sh` | Script de setup para Linux/macOS |
| `setup-pipeline.ps1` | Script de setup para Windows |
| `PIPELINE_README.md` | Este archivo |

---

## 🚀 Quick Start

### Opción 1: Setup Automático (Recomendado)

#### En Windows PowerShell:
```powershell
# Abrir PowerShell como Administrador
.\setup-pipeline.ps1

# O con parámetros específicos
.\setup-pipeline.ps1 -Organization "myorg" -Project "myproject" -SubscriptionId "xxx"
```

#### En Linux/macOS:
```bash
chmod +x setup-pipeline.sh
./setup-pipeline.sh
```

### Opción 2: Setup Manual

1. **Crear Service Connections en Azure DevOps:**
   - Ir a Project Settings > Service Connections
   - Crear "AzureSubscription" (Azure Resource Manager)
   - Crear "AzureContainerRegistry" (Docker Registry)

2. **Actualizar variables en `azure-pipelines.yml`:**
   ```yaml
   variables:
     REGISTRY_NAME: 'tu-acr-name'
     AZURE_RESOURCE_GROUP: 'tu-resource-group'
     AZURE_WEB_APP_NAME: 'tu-web-app'
   ```

3. **Crear Pipeline en Azure DevOps:**
   - Pipelines > New Pipeline
   - Seleccionar repositorio
   - Seleccionar "azure-pipelines.yml" existente

---

## 📊 Estructura del Pipeline

### Variables Parametrizadas

```yaml
# Node.js Configuration
NODE_VERSION: '18.x'
NODE_ENV_BUILD: 'production'

# Docker Registry
REGISTRY_NAME: 'acrfullstacktest'
REGISTRY_FQDN: '$(REGISTRY_NAME).azurecr.io'

# Backend Image
BACKEND_IMAGE_NAME: 'fullstack-test/backend'
BACKEND_DOCKERFILE: 'backend/Dockerfile'

# Frontend Image
FRONTEND_IMAGE_NAME: 'fullstack-test/frontend'
FRONTEND_DOCKERFILE: 'frontend/Dockerfile'

# Azure Web App
AZURE_RESOURCE_GROUP: 'rg-fullstack-test'
AZURE_WEB_APP_NAME: 'webapp-fullstack-test'
AZURE_LOCATION: 'East US'
```

### Stages Disponibles

#### 1. **Build Backend** (Siempre)
```
✓ Setup Node.js 18.x
✓ Caché de node_modules
✓ npm ci (instalación limpia)
✓ Compilación TypeScript
✓ Lint (ESLint)
✓ Tests unitarios
✓ Publicación de artefactos
```

#### 2. **Build Frontend** (Siempre)
```
✓ Setup Node.js 18.x
✓ Caché de node_modules
✓ npm ci
✓ Build con Vite
✓ Lint
✓ Publicación de artefactos
```

#### 3. **Build Docker Images** (Después de Builds)
```
✓ Build imagen Backend
✓ Build imagen Frontend
✓ Múltiples tags (build#, latest, rama)
✓ Metadatos (fecha, commit, versión)
```

#### 4. **Push to ACR** (Solo ramas principales)
```
✓ Autenticación ACR
✓ Push Backend image
✓ Push Frontend image
✓ Tagging automático
```

#### 5. **Deploy Development** (Solo `develop`)
```
✓ Despliegue a webapp-fullstack-test-dev
✓ Entorno: development
✓ Automático sin aprobación
```

#### 6. **Deploy Staging** (Solo `release/*`)
```
✓ Despliegue a webapp-fullstack-test-staging
✓ Entorno: staging
✓ Automático sin aprobación
```

#### 7. **Deploy Production** (Solo `master`)
```
✓ Despliegue a webapp-fullstack-test
✓ Entorno: production
✓ Requiere aprobación manual
✓ Escalado automático
```

---

## 🔀 Flujo por Rama

```
feature/feature-name
    │
    └─> Build Backend ✓
        Build Frontend ✓
        (Sin Push a ACR)
        (Sin Deploy)

develop (rama de desarrollo)
    │
    └─> Build Backend ✓
        Build Frontend ✓
        Push a ACR ✓
        Deploy a Development ✓

release/v1.0 (rama de release)
    │
    └─> Build Backend ✓
        Build Frontend ✓
        Push a ACR ✓
        Deploy a Staging ✓

master (rama de producción)
    │
    └─> Build Backend ✓
        Build Frontend ✓
        Push a ACR ✓
        Deploy a Production ✓ (con aprobación)
```

---

## 🔧 Customización

### Cambiar Versión de Node.js

En `azure-pipelines.yml`:
```yaml
variables:
  NODE_VERSION: '20.x'  # Cambiar a 20
```

### Cambiar Timeouts

```yaml
variables:
  BUILD_TIMEOUT_MINUTES: 45  # Aumentar timeout
```

### Agregar Pasos Adicionales

```yaml
- stage: Build_Backend
  jobs:
    - job: BuildBackendJob
      steps:
        - script: |
            echo "Custom step"
          displayName: 'Mi paso custom'
```

### Cambiar Estrategia de Deploy

```yaml
strategy:
  runOnce:
    deploy:
      steps:
        # Tus pasos aquí
```

---

## 📈 Monitoreo

### Ver Logs del Pipeline

1. **Azure DevOps:**
   - Pipelines > [Tu Pipeline]
   - Click en Build #
   - Expandir Jobs/Steps para ver logs

2. **Desde CLI:**
   ```bash
   az pipelines build list --organization $ORGANIZATION --project $PROJECT
   az pipelines build show --id $BUILD_ID
   ```

### Artefactos Generados

```
Build Artifacts:
├── backend-build/
│   └── dist/                    # Backend compilado
└── frontend-build/
    └── dist/                    # Frontend compilado

Docker Images (en ACR):
├── acrname.azurecr.io/fullstack-test/backend:20251226.1
├── acrname.azurecr.io/fullstack-test/backend:latest
├── acrname.azurecr.io/fullstack-test/backend:develop
└── acrname.azurecr.io/fullstack-test/frontend:20251226.1
```

---

## 🔐 Seguridad

### Credenciales

- ✅ Variables de secreto en Azure DevOps
- ✅ Service Connections (no exponer credenciales)
- ✅ Azure Key Vault para secretos sensibles (opcional)
- ✅ Aprobación manual para Production

### Variables Sensibles

```yaml
# NO hacer esto:
variables:
  ACR_PASSWORD: 'micontraseña'  # ❌ NUNCA

# Usar Service Connection:
- task: Docker@2
  inputs:
    containerRegistry: 'AzureContainerRegistry'  # ✅ BIEN
```

### Validación de Imágenes

```yaml
# Agregar scanning (opcional)
- script: |
    az acr scan --registry $REGISTRY_NAME --image-name $BACKEND_IMAGE_NAME:latest
```

---

## 🚨 Troubleshooting

### Problema: Build lento
**Solución:** 
- Verificar caché está activo
- Aumentar recursos de agent
- Revisar Dockerfile para optimizar layers

### Problema: Push a ACR falla
**Solución:**
- Verificar Service Connection "AzureContainerRegistry"
- Verificar credenciales ACR
- Verificar región ACR

### Problema: Deploy falla
**Solución:**
- Verificar Web App existe
- Verificar credenciales de deploy
- Revisar logs en Azure Portal

### Problema: Variables no se resuelven
**Solución:**
- Usar `$(VariableName)` no `$VariableName`
- Verificar variable está en scope correcto
- Revisar sintaxis YAML

---

## 📝 Variables de Entorno por Stage

### Development
```yaml
NODE_ENV: 'development'
VITE_API_BASE_URL: 'http://localhost:3000/api'
LOG_LEVEL: 'debug'
DATABASE: 'fullstack_test_dev'
```

### Staging
```yaml
NODE_ENV: 'staging'
VITE_API_BASE_URL: 'https://staging.app.com/api'
LOG_LEVEL: 'info'
DATABASE: 'fullstack_test_staging'
```

### Production
```yaml
NODE_ENV: 'production'
VITE_API_BASE_URL: 'https://app.com/api'
LOG_LEVEL: 'warn'
DATABASE: 'fullstack_test_prod'
```

---

## 🎯 Mejores Prácticas

### 1. Cachear Dependencias
```yaml
- task: Cache@2
  inputs:
    key: $(CACHE_KEY)
    path: $(PATH_TO_CACHE)
```

### 2. Usar Conditional Stages
```yaml
condition: |
  and(
    succeeded(),
    eq(variables['Build.SourceBranch'], 'refs/heads/master')
  )
```

### 3. Parametrizar Todo
```yaml
variables:
  # En vez de hardcodear valores
  WEB_APP_NAME: '$(AZURE_WEB_APP_NAME)-$(ENVIRONMENT)'
```

### 4. Logging y Debugging
```bash
echo "Build ID: $(Build.BuildId)"
echo "Branch: $(Build.SourceBranch)"
echo "Commit: $(Build.SourceVersion)"
```

### 5. Notificaciones
```yaml
- task: PublishBuildArtifacts@1
  condition: failed()
```

---

## 📚 Referencias

- [Azure Pipelines Docs](https://docs.microsoft.com/en-us/azure/devops/pipelines)
- [YAML Schema Reference](https://docs.microsoft.com/en-us/azure/devops/pipelines/yaml-schema)
- [Docker Task](https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/build/docker)
- [Azure Web App Deployment](https://docs.microsoft.com/en-us/azure/app-service/deploy-zip)
- [Azure Container Registry](https://learn.microsoft.com/en-us/azure/container-registry/)

---

## 💡 Ejemplos de Comandos Útiles

### Listar Builds
```bash
az pipelines build list \
  --organization $ORGANIZATION \
  --project $PROJECT
```

### Ver Logs de Build
```bash
az pipelines build show \
  --id $BUILD_ID \
  --organization $ORGANIZATION \
  --project $PROJECT
```

### Listar Imágenes en ACR
```bash
az acr repository list --name $ACR_NAME
```

### Ver Tags de Imagen
```bash
az acr repository show-tags \
  --name $ACR_NAME \
  --repository fullstack-test/backend
```

---

## 📞 Soporte

Para problemas o preguntas:
1. Revisar `PIPELINE_SETUP.md` para guía completa
2. Revisar `.azure/pipeline-variables.yml` para variables disponibles
3. Consultar logs en Azure DevOps
4. Revisar [documentación oficial](https://docs.microsoft.com/en-us/azure/devops/pipelines)

---

**Última actualización:** 26/12/2025  
**Versión:** 1.0  
**Autor:** Pedro Abel Rivera Vera  
**Licencia:** MIT
