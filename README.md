# Prueba Técnica - Fullstack Developer (Node.js + React)

¡Bienvenido(a) a la prueba técnica para el puesto de **Desarrollador Fullstack**!

Esta prueba evaluará tus habilidades en el desarrollo de aplicaciones full-stack modernas utilizando **Node.js**, **Express**, **React**, y bases de datos. Tendrás **48 horas** para completar el desafío.

---

## 📋 Descripción del Proyecto

Desarrollarás una **plataforma de gestión de proyectos y tareas colaborativa** donde los usuarios pueden:

- Registrarse e iniciar sesión de forma segura
- Crear y gestionar proyectos
- Asignar tareas a diferentes proyectos
- Colaborar con otros usuarios en proyectos compartidos
- Filtrar, buscar y ordenar tareas por diferentes criterios
- Ver estadísticas básicas de sus proyectos

---

## 🛠️ Stack Tecnológico Requerido

### Backend
- **Runtime**: Node.js (v18 o superior)
- **Framework**: Express.js
- **Lenguaje**: TypeScript
- **Base de Datos**: MySQL **o** MongoDB (elige una)
- **Autenticación**: JWT (JSON Web Tokens)
- **Documentación API**: Swagger/OpenAPI

### Frontend
- **Framework**: React (v18 o superior)
- **Lenguaje**: TypeScript
- **Routing**: React Router v6
- **Estilos**: TailwindCSS (preferencia)

### DevOps (Opcional)
- **Containerización**: Docker + Docker Compose

**Nota**: Puedes usar cualquier otra librería o herramienta que consideres necesaria. Documenta tus decisiones técnicas en el archivo `TECHNICAL_DECISIONS.md`.

---

## 📦 Funcionalidades Requeridas

### 1. Autenticación y Usuarios

**Backend:**
- Registro de usuarios con validación
- Login con generación de JWT
- Middleware de autenticación para proteger rutas
- Hash de contraseñas
- Endpoint para obtener perfil del usuario autenticado

**Frontend:**
- Formularios de registro y login con validaciones
- Almacenamiento del token de autenticación
- Rutas protegidas que requieren autenticación
- Redirección automática según estado de autenticación

---

### 2. Gestión de Proyectos

**Backend:**
- CRUD completo de proyectos
- Solo el creador del proyecto puede editarlo o eliminarlo
- Sistema de colaboradores: añadir usuarios a proyectos
- Paginación en listado de proyectos

**Frontend:**
- Lista de proyectos con diseño responsive
- Crear, editar y eliminar proyectos
- Búsqueda y filtrado de proyectos
- Gestión de colaboradores

---

### 3. Gestión de Tareas

**Backend:**
- CRUD completo de tareas
- Las tareas pertenecen a un proyecto
- Estados: "pendiente", "en progreso", "completada"
- Prioridades: "baja", "media", "alta"
- Asignar tareas a colaboradores del proyecto
- Filtros por estado, prioridad, proyecto, usuario asignado
- Ordenamiento flexible

**Frontend:**
- Visualización de tareas (lista, kanban, o tu propuesta)
- Crear, editar y eliminar tareas
- Cambiar estado de tareas
- Filtros interactivos
- Asignación de tareas a usuarios

---

### 4. Dashboard y Estadísticas

**Backend:**
- Endpoint con estadísticas del usuario:
  - Total de proyectos
  - Total de tareas
  - Tareas por estado
  - Otras métricas relevantes

**Frontend:**
- Dashboard con visualización de estadísticas
- Resumen de actividad del usuario

---

## 📊 Criterios de Evaluación

Tu proyecto será evaluado en base a:

| Criterio | Peso |
|----------|------|
| **Funcionalidad** | 30% |
| **Calidad del Código** | 25% |
| **Arquitectura y Diseño** | 15% |
| **Seguridad** | 10% |
| **UI/UX** | 10% |
| **Documentación** | 5% |
| **Testing** | 5% |

### Puntos Extra (hasta +30%)
- Docker implementation completa (+10%)
- Tests exhaustivos (+5%)
- Funcionalidades adicionales (+5%)
- CI/CD pipeline (+5%)
- Deploy en producción (+5%)

---

## 📝 Instrucciones de Entrega

1. **Fork del repositorio**: Crea un fork de este repositorio

2. **Rama de trabajo**:
   ```
   test/tu-nombre-completo
   ```

3. **Estructura del proyecto**:
   ```
   /
   ├── backend/
   ├── frontend/
   ├── TECHNICAL_DECISIONS.md    # Documenta tus decisiones aquí
   ├── docker-compose.yml         # (opcional)
   └── README.md                  # Actualiza con instrucciones de ejecución
   ```

4. **Documentación requerida**:
   - Actualiza este README con instrucciones de instalación y ejecución
   - Completa el archivo `TECHNICAL_DECISIONS.md` explicando tus elecciones
   - Documenta tu API con Swagger
   - Incluye al menos 5 tests

5. **Pull Request**: Una vez completado, crea un PR hacia el repositorio original

---

## ⏱️ Tiempo

Tienes **48 horas** desde que recibes esta prueba. Gestiona tu tiempo según tus prioridades.

---

## ❓ Preguntas Frecuentes

**¿Puedo usar librerías adicionales?**
Sí, documenta tus elecciones en `TECHNICAL_DECISIONS.md`.

**¿Qué base de datos uso?**
La que prefieras (MySQL o MongoDB). No afecta la evaluación.

**¿Es obligatorio Docker?**
No, pero suma puntos extra.

**¿Puedo usar librerías de UI?**
Sí. Recomendamos TailwindCSS para estilos, pero también puedes usar otras librerías de componentes (Material-UI, Ant Design, etc.).

---

## 🎉 ¡Buena suerte!

Recuerda: evaluamos no solo que funcione, sino **cómo está construido**. Demuestra tu criterio técnico y mejores prácticas.

Si tienes dudas sobre los requisitos, no dudes en contactarnos.

---

# 📖 Instrucciones de Ejecución

## Prerrequisitos
- Node.js v18 o superior
- npm o yarn
- MongoDB (local o acceso a MongoDB Atlas)
- Docker y Docker Compose (opcional, para ejecución containerizada)

## Instalación

### 1. Clonar el repositorio y acceder al directorio
```bash
git clone <repository-url>
cd Fullstack_Test_01
```

### 2. Instalar dependencias del Backend
```bash
cd backend
npm install
```

### 3. Instalar dependencias del Frontend
```bash
cd ../frontend
npm install
```

## Configuración

### Variables de entorno - Backend
Crear archivo `.env` en la carpeta `backend/`:
```bash
MONGODB_URI=mongodb://localhost:27017/project_management
JWT_SECRET=tu_secreto_jwt_aqui
ENTRA_CLIENT_ID=tu_client_id
ENTRA_CLIENT_SECRET=tu_client_secret
ENTRA_TENANT_ID=tu_tenant_id
NODE_ENV=development
PORT=3000
```

### Variables de entorno - Frontend
Crear archivo `.env` en la carpeta `frontend/`:
```bash
VITE_API_URL=http://localhost:3000/api
```

## Ejecución

### Opción 1: Ejecución Local (sin Docker)

#### Backend
```bash
cd backend
npm run dev
# El servidor estará disponible en http://localhost:3000
```

#### Frontend (en otra terminal)
```bash
cd frontend
npm run dev
# La aplicación estará disponible en http://localhost:5173
```

### Opción 2: Ejecución con Docker Compose
```bash
# Desde la raíz del proyecto
docker-compose up
# Backend: http://localhost:3000
# Frontend: http://localhost:5173
# MongoDB: localhost:27017
```

### Construcción para Producción

#### Backend
```bash
cd backend
npm run build
npm start
```

#### Frontend
```bash
cd frontend
npm run build
npm preview
```

## Tests

### Tests del Backend
```bash
cd backend

# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```

### Linting y Formateo
```bash
# Verificar linting
npm run lint

# Arreglar issues de linting
npm run lint:fix

# Formatear código
npm run format
```

## API Documentation
- Swagger/OpenAPI: `http://localhost:3000/api-docs`

## Credenciales de Prueba
- Email: `test@example.com`
- Password: `Test123!@#`

**Nota**: Las credenciales pueden variar según tu configuración. Consulta la base de datos para usuarios existentes.
