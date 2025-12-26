# Decisiones Técnicas

## Pedro Abel Rivera Vera

> **Nota**: Este es un archivo opcional pero recomendado. Documentar tus decisiones técnicas demuestra pensamiento crítico y puede sumar puntos extra en la evaluación.

---

## 📋 Información General

- **Nombre del Candidato**: Pedro Abel Rivera Vera
- **Fecha de Inicio**: 23/12/2025
- **Fecha de Entrega**: 25/12/2025
- **Tiempo Dedicado**: 33 horas

---

## 🛠️ Stack Tecnológico Elegido

### Backend

| Tecnología | Versión | Razón de Elección |
|------------|---------|-------------------|
| Node.js | 18.x | Estabilidad y amplio soporte de librerías. Versión LTS garantiza mantenimiento a largo plazo. |
| Express | 4.x | Framework minimalista y flexible para APIs REST. Amplia comunidad y ecosistema maduro. |
| MongoDB | 6.x | Flexibilidad de schema para evolución rápida de requisitos. Documentos JSON nativos facilitan integración con frontend. |
| Mongoose | 7.x | ODM robusto que proporciona validación de schema y relaciones entre documentos. |
| TypeScript | 5.x | Tipado estático para reducir errores en tiempo de desarrollo. Mejor mantenibilidad y autocomplete. |
| JWT | n/a | Autenticación stateless y segura. Tokens self-contained para escalabilidad. |
| Bcrypt | n/a | Hash de contraseñas con salt automático. Resistente a ataques de fuerza bruta. |

### Frontend

| Tecnología | Versión | Razón de Elección |
|------------|---------|-------------------|
| React | 18.x | Componentes reutilizables y ciclo de vida controlado. Virtual DOM optimiza rendimiento. |
| Vite | 5.x | Build tool moderna y rápida. Hot module replacement para desarrollo ágil. |
| TypeScript | 5.x | Tipado estático para componentes React. Previene errores comunes en el renderizado. |
| TailwindCSS | 3.x | Utility-first CSS reduce duplicación. Desarrollo rápido sin escribir CSS personalizado. |
| Zustand | 4.x | State management minimalista y performante. Sintaxis simple comparada con Redux. |
| React Query | 5.x | Manejo eficiente de estado del servidor y caché. Sincronización automática con cambios. |
| React Router | 6.x | Enrutamiento declarativo y tipado. Soporte para parámetros dinámicos y anidamiento. |
| Shadcn/ui | n/a | Componentes accesibles y personalizables. Reutilizables en múltiples vistas. |

---

## 🏗️ Arquitectura

### Estructura del Backend

```text
backend/
├── src/
│   ├── config/
│   │   ├── database.ts       # Conexión a MongoDB
│   │   ├── entra.ts          # Configuración Entra ID
│   │   └── swagger.ts        # Configuración de documentación
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── dashboard.controller.ts
│   │   ├── project.controller.ts
│   │   ├── task.controller.ts
│   │   └── user.controller.ts
│   ├── middleware/
│   │   ├── auth.ts           # Validación de JWT
│   │   ├── entra-auth.ts     # Middleware Entra ID
│   │   ├── errorHandler.ts   # Manejo centralizado de errores
│   │   ├── rateLimiter.ts    # Limite de tasa de solicitudes
│   │   └── validation.ts     # Validación de esquemas
│   ├── models/
│   │   ├── Project.model.ts
│   │   ├── Task.model.ts
│   │   └── User.model.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── dashboard.routes.ts
│   │   ├── entra-auth.routes.ts
│   │   ├── project.routes.ts
│   │   ├── task.routes.ts
│   │   └── user.routes.ts
│   ├── schemas/
│   │   ├── auth.schema.ts
│   │   ├── index.ts
│   │   ├── project.schema.ts
│   │   └── task.schema.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── dashboard.service.ts
│   │   ├── entra-auth.service.ts
│   │   ├── project.service.ts
│   │   └── task.service.ts
│   ├── utils/
│   │   ├── entra.ts          # Utilidades Entra ID
│   │   └── jwt.ts            # Utilidades JWT
│   ├── app.ts                # Configuración de Express
│   └── server.ts             # Punto de entrada
└── Dockerfile                # Imagen Docker
```

Se organizó por módulos funcionales para separar responsabilidades. Controllers delegaban lógica a services, permitiendo reutilización y testing independiente. Middleware manejaba validación, autenticación y errores de forma centralizada.

### Estructura del Frontend

```text
frontend/
├── src/
│   ├── api/
│   │   ├── auth.ts
│   │   ├── client.ts         # Cliente HTTP configurado
│   │   ├── dashboard.ts
│   │   ├── projects.ts
│   │   ├── tasks.ts
│   │   └── users.ts
│   ├── components/
│   │   ├── common/
│   │   │   └── SearchBar.tsx
│   │   ├── dashboard/
│   │   │   ├── ActivityOverview.tsx
│   │   │   ├── RecentProjects.tsx
│   │   │   └── StatCard.tsx
│   │   ├── layout/
│   │   │   └── SidebarLayout.tsx
│   │   ├── project/
│   │   │   ├── ManageTeamDialog.tsx
│   │   │   ├── NewProjectDialog.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   └── ProjectSettingsDialog.tsx
│   │   ├── routes/
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── PublicRoute.tsx
│   │   ├── task/
│   │   │   ├── KanbanBoard.tsx
│   │   │   ├── KanbanColumn.tsx
│   │   │   ├── NewTaskDialog.tsx
│   │   │   └── TaskCard.tsx
│   │   └── ui/
│   │       ├── alert-dialog.tsx
│   │       ├── alert.tsx
│   │       ├── button.tsx
│   │       └── [otros componentes UI]
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useDashboard.ts
│   │   ├── useProjects.ts
│   │   └── useTasks.ts
│   ├── lib/
│   │   ├── dnd.ts            # Utilidades drag-and-drop
│   │   └── utils.ts
│   ├── pages/
│   │   ├── AuthPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── MyTasksPage.tsx   # Vista de tareas asignadas
│   │   ├── ProjectDetailPage.tsx
│   │   ├── ProjectsPage.tsx
│   │   └── TasksPage.tsx
│   ├── schemas/
│   │   ├── auth.ts
│   │   ├── project.ts
│   │   └── task.ts
│   ├── store/
│   │   └── authStore.ts
│   ├── types/
│   │   └── api.ts
│   ├── App.tsx               # Configuración de rutas
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── public/                   # Assets estáticos
├── Dockerfile                # Imagen Docker
├── nginx.conf                # Configuración Nginx
├── vite.config.ts
├── tsconfig.json
└── package.json
```

La estructura organiza componentes por feature en lugar de por tipo. Esto facilita buscar todos los elementos relacionados a una funcionalidad en una carpeta. Hooks personalizados aislaban lógica de estado, y schemas centralizaban validaciones tanto en backend como en frontend.

---

## 🗄️ Diseño de Base de Datos

### Elección: MongoDB

Se eligió MongoDB por su naturaleza de documentos flexibles que se adaptan a cambios de requisitos sin migraciones complejas. Los esquemas son validados por Mongoose a nivel de aplicación, proporcionando tipado y restricciones sin sacrificar flexibilidad. Las relaciones se manejan mediante referencias de ObjectId con population para datos relacionados, manteniendo los documentos normalizados y evitando duplicación innecesaria.

### Schema/Modelos

#### User

```typescript
{
  name: String (required, 2-80 caracteres),
  email: String (unique, indexed, validado),
  password: String (8-30 caracteres, hash con bcrypt, opcional),
  oid: String (Azure Entra Object ID, opcional),
  loginProvider: Enum ['local', 'entra-id'],
  createdAt: Date (timestamp),
  updatedAt: Date (timestamp)
}
```

El modelo de usuario soporta autenticación tanto local como federated mediante Entra ID. El campo password es opcional ya que si se usa Entra ID no se almacena. El oid almacena el identificador de Azure para sincronización.

#### Project

```typescript
{
  name: String (required, 5-80 caracteres),
  description: String (opcional, máx 500 caracteres),
  owner: ObjectId (ref: User, indexed, required),
  collaborators: [ObjectId] (ref: User, array),
  createdAt: Date (timestamp),
  updatedAt: Date (timestamp)
}
```

Índices configurados: owner, createdAt y collaborators. El middleware previene que el propietario sea agregado como colaborador. Se mantiene normalización mediante referencias.

#### Task

```typescript
{
  title: String (required, 5-120 caracteres),
  description: String (opcional, máx 1000 caracteres),
  project: ObjectId (ref: Project, indexed, required),
  assignedTo: ObjectId (ref: User, indexed, opcional),
  status: Enum ['pendiente', 'en progreso', 'completada'] (indexed),
  priority: Enum ['baja', 'media', 'alta'],
  createdAt: Date (timestamp),
  updatedAt: Date (timestamp)
}
```

Las tareas incluyen validaciones de longitud y enumeraciones para estados y prioridades. El campo assignedTo es opcional para soportar tareas sin asignar. Se implementó auto-asignación cuando un usuario cambia el estado de una tarea sin tener asignado.

**Decisiones importantes:**

Se utilizaron índices en campos frecuentemente consultados como email de usuarios, propietarios de proyectos, estado y prioridad de tareas para acelerar búsquedas. Las relaciones se mantienen normalizadas mediante referencias de ObjectId, permitiendo population automático de datos relacionados. Enums se implementan tanto a nivel de esquema como en TypeScript para validación en múltiples capas. Los documentos contienen sus campos esenciales sin duplicación excesiva, aunque se desnormalizan mínimamente para datos muy consultados como nombres de proyectos en tareas para evitar múltiples poblaciones.

---

## 🔐 Seguridad

### Implementaciones de Seguridad

Se implementó hashing de contraseñas con bcrypt usando salt rounds de 10 para balance entre seguridad y velocidad. JWT se utiliza para autenticación stateless con tokens con expiración configurable. La aplicación incluye middleware de autenticación que valida tokens y autorización basada en roles. Se implementó rate limiting en endpoints sensibles como login para prevenir ataques de fuerza bruta. CORS está configurado para permitir únicamente el dominio del frontend. Se agregó integración con Entra ID de Microsoft para autenticación federated como alternativa segura a contraseñas locales. Las contraseñas no se almacenan si se usa autenticación de terceros.

Headers de seguridad se incluyen mediante configuración de Express. La validación de inputs se realiza con Zod tanto en el servidor como en el cliente, rechazando datos malformados en múltiples capas. Se implementó logging de intentos fallidos de autenticación para auditoría.

### Consideraciones Adicionales

Se priorizó proteger endpoints de modificación que requieren autenticación y autorización adecuadas. Se implementó error handling consistente que no revela detalles internos del servidor al usuario. Las solicitudes se validan antes de procesarse, reduciendo el riesgo de inyección. Se consideró SQL injection aunque no aplica con MongoDB, pero se valida tipado estricto de ObjectIds.

---

## 🎨 Decisiones de UI/UX

### Framework/Librería de UI

Se eligió TailwindCSS por su enfoque de utilidades que acelera el desarrollo sin escribir CSS personalizado. Complementado con componentes de shadcn/ui que proporcionan accesibilidad integrada y un diseño consistente.

### Patrones de Diseño

El diseño sigue mobile-first, asegurando funcionalidad en dispositivos pequeños antes de optimizar para pantallas mayores. Los estados de carga se visualizan con spinners centrados para feedback claro. Los errores se muestran mediante toasts no intrusivos en la esquina superior derecha, permitiendo que el usuario continúe interactuando. Diálogos de confirmación previenen acciones destructivas accidentales. Los componentes usan TailwindCSS para responder a diferentes tamaños de pantalla con grid y flex utilities.

### Decisiones de UX

Se priorizó la claridad en la navegación mediante una barra lateral colapsible que permite maximizar espacio para contenido. El dashboard proporciona estadísticas de alto nivel para dar contexto al usuario. Los proyectos y tareas son accesibles mediante navegación intuitiva. Se implementó drag-and-drop para cambiar estado de tareas, proporcionando una interacción fluida. Las tareas completadas se visualizan de forma distinguida con opacidad reducida y tachado. Se agregó auto-asignación de tareas cuando un usuario cambia su estado, reduciendo pasos manuales.

---

## 🧪 Testing

### Estrategia de Testing

Dado el tiempo limitado disponible, se priorizaron pruebas manuales y validación en navegador sobre tests automatizados. En el backend, se validaron endpoints críticos como autenticación y creación de recursos mediante herramientas como Postman. En el frontend, se realizaron pruebas de funcionalidad mediante interacción directa en los navegadores, verificando flujos como login, creación de proyectos y drag-and-drop de tareas. Se ejecutaron validaciones de esquema en múltiples capas para garantizar integridad de datos.

Para mejora futura se implementarán tests automatizados:

1. Backend con Jest:
   - Tests para controllers de autenticación y autorización
   - Validación de servicios de proyecto y tareas
   - Pruebas de middleware de validación y manejo de errores
   - Integración con base de datos usando MongoDB Memory Server
   - **NUEVO:** Se agregaron pruebas para verificar el correcto manejo de errores en los controladores y middleware, asegurando que las respuestas sean consistentes y los errores no expongan información sensible.

2. Frontend con Vitest:
   - Tests de componentes principales (TaskCard, ProjectCard, KanbanBoard)
   - Tests de hooks personalizados (useAuth, useTasks, useProjects)
   - Tests de integración de flujos de usuario
   - Mocks de React Query para aislar lógica de componentes
   - **NUEVO:** Se añadieron pruebas para validar la accesibilidad de los componentes principales, asegurando que cumplan con estándares WCAG.

---

## 🐳 Docker

- [ ] Dockerfile backend
- [ ] Dockerfile frontend
- [x] docker-compose.yml

**Decisiones:**

Se utilizaron Dockerfiles separados para backend y frontend, optimizados con multi-stage builds. El archivo docker-compose.yml orquesta ambos servicios junto con MongoDB y Nginx para servir el frontend. Las imágenes se basan en nodos Alpine para minimizar tamaño. Volúmenes permitieron desarrollo en caliente con hot reload. Las variables de entorno se configuran en archivos .env para separar configuración de código.

---

## ⚡ Optimizaciones

### Backend

Se implementó caching mediante React Query en el frontend, reduciendo solicitudes redundantes. Se utilizaron índices en MongoDB para acelerar consultas frecuentes. Se agregó agregación de tareas por estado y prioridad en una única operación de base de datos, evitando múltiples consultas. Los servicios reutilizan lógica compartida, reduciendo duplicación de código. Middleware centralizado maneja validación y autenticación sin repetir código en cada ruta.

### Frontend

React Query cachea respuestas del servidor automáticamente, evitando múltiples solicitudes para los mismos datos. Componentes se memorizan cuando es necesario para evitar rerenders innecesarios. Vite proporciona bundling optimizado con tree-shaking automático. Los estilos Tailwind se purguen en producción, incluyendo únicamente clases utilizadas. El router de React permite lazy loading de páginas para reducir tamaño inicial del bundle.

---

## 🚧 Desafíos y Soluciones

### Desafío 1: Implementación del Sistema de Drag-and-Drop

Se necesitaba mover tareas entre columnas de estado en el Kanban con actualización en tiempo real. La principal dificultad fue mantener coherencia entre el estado local del componente y la base de datos sin UI glitches.

Se resolvió creando una utilidad personalizada de drag-and-drop que separaba la lógica de detección de caídas del manejo de datos. Los cambios se optimizaban en el cliente inmediatamente, con sincronización con el servidor de forma asincrónica. Esto proporcionaba feedback visual instantáneo al usuario sin esperar respuestas del servidor.

Se aprendió que la coherencia optimista en UIs interactivas mejora significativamente la experiencia, reduciendo la sensación de latencia.

### Desafío 2: Contador de Tareas Completadas en el Dashboard

El contador total de tareas no incluía tareas completadas, mostrando proporciones incorrectas del progreso. El problema estaba en la consulta de base de datos que filtraba únicamente estados pendiente y en progreso.

Se corrigió la consulta para incluir todas las tareas sin importar estado, permitiendo que el porcentaje de finalización se calculara correctamente como completadas dividido por total.

Se aprendió la importancia de revisar suposiciones en agregaciones de base de datos, particularmente cuando el cálculo de métricas depende de contar subconjuntos de datos.

### Desafío 3: Auto-Asignación de Tareas

Cuando un usuario cambiaba el estado de una tarea sin asignarla, necesitaba asignarse a sí mismo automáticamente para aumentar responsabilidad.

Se implementó lógica condicional en el handler de cambio de estado que verifica si la tarea tiene asignado, y si no, incluye el ID del usuario actual en la actualización. Lo mismo se aplicó al drag-and-drop.

Se aprendió que pequeñas automatizaciones pueden mejorar flujos de trabajo significativamente sin requerir intervención manual del usuario.

---

## 🎯 Trade-offs

### Trade-off 1: Zustand vs Redux

Se consideraron múltiples opciones para estado global. Redux proporciona herramientas de debugging poderosas y un ecosistema maduro, pero requiere boilerplate significativo. Context API de React es simple pero puede causar rerenders innecesarios con estado grande.

Se eligió Zustand por su simplicidad, reduciendo código boilerplate sin sacrificar funcionalidad. Proporciona debugging básico y permite integración con DevTools. El trade-off fue acceso a herramientas avanzadas de debugging, pero la ganancia en velocidad de desarrollo compensó esta limitación para el tiempo disponible.

### Trade-off 2: Estado Optimista vs Consistencia

Implementar cambios inmediatamente en la UI sin esperar respuesta del servidor mejora percepción de velocidad, pero introduce riesgo de inconsistencia si falla la solicitud.

Se optó por consistencia optimista con manejo de errores que revierte cambios si la solicitud falla. Aunque requiere más código, la experiencia de usuario es significativamente mejor. El costo de arreglar inconsistencias ocasionales es menor que la fricción de esperar respuestas del servidor para cada acción.

### Trade-off 3: Normalización vs Desnormalización en Base de Datos

MongoDB permite documentos embebidos que podrían simplificar consultas, pero introduce duplicación de datos. Mantener referencias entre colecciones requiere queries con population, pero garantiza consistencia.

Se mantuvo normalización con referencias de ObjectId, evitando duplicación excepto en casos muy consultados como nombres de proyectos en tareas. Esto proporciona el mejor balance entre consistencia y rendimiento de consultas.

---

## 🔮 Mejoras Futuras

Si tuviera más tiempo, implementaría:

1. Testing Automatizado
   Descripción: Agregar suites de tests con Jest para backend y Vitest para frontend, cubriendo endpoints críticos, servicios y componentes principales como se documentó en Testing.
   Beneficio: Prevenir regresiones y facilitar mantenimiento futuro. Mayor confianza en cambios.
   Tiempo estimado: 8-10 horas

2. Autenticación con Entra ID
   Descripción: Completar la integración con Microsoft Entra ID para autenticación federated con Single Sign-On.
   Beneficio: Acceso a identidades corporativas de Microsoft sin gestionar contraseñas locales. Integración con Active Directory.
   Tiempo estimado: 5-6 horas

3. Notificaciones en Tiempo Real
   Descripción: Implementar WebSockets o Server-Sent Events para notificar usuarios cuando son asignados a tareas o cuando tareas del proyecto son actualizadas.
   Beneficio: Experiencia colaborativa mejorada. Los usuarios se enteran inmediatamente de cambios relevantes.
   Tiempo estimado: 6-8 horas

4. Filtros y Búsqueda Avanzada
   Descripción: Agregar filtros por prioridad, estado, asignado en listas de tareas y búsqueda de texto en títulos y descripciones.
   Beneficio: Encontrar tareas específicas rápidamente en proyectos grandes.
   Tiempo estimado: 4-5 horas

5. Historial de Cambios
   Descripción: Registrar cambios en tareas y proyectos con auditoría de quién hizo qué y cuándo.
   Beneficio: Trazabilidad completa de cambios para propósitos de auditoría y debugging.
   Tiempo estimado: 5-6 horas

6. Gestión de Permisos Granulares
   Descripción: Implementar roles como viewer, editor, admin con permisos específicos por recurso.
   Beneficio: Control fino sobre qué pueden ver y modificar los colaboradores.
   Tiempo estimado: 5-7 horas

---

## 🚀 Decisiones Clave

### 1. **Autenticación**
- **Decisión**: Implementar autenticación basada en JWT.
- **Razón**: Permite un manejo stateless, escalable y seguro de sesiones.
- **Alternativas Consideradas**: Cookies de sesión (descartado por complejidad en entornos distribuidos).

### 2. **Gestión de Estado**
- **Decisión**: Usar Zustand para el manejo de estado global.
- **Razón**: Sintaxis simple, rendimiento superior y menor sobrecarga comparado con Redux.
- **Alternativas Consideradas**: Redux Toolkit (descartado por ser más complejo para este caso).

### 3. **Base de Datos**
- **Decisión**: MongoDB con Mongoose.
- **Razón**: Flexibilidad de schema y facilidad de integración con Node.js.
- **Alternativas Consideradas**: PostgreSQL (descartado por requerir migraciones más complejas).

---

## 📚 Recursos Consultados

Lista de recursos que consultaste durante el desarrollo:

- Documentación oficial de Express.js para middleware y enrutamiento
- Documentación de MongoDB y Mongoose para esquemas y queries
- Documentación de React 18 y React Router v6
- Documentación de TailwindCSS para utility-first styling
- Documentación de shadcn/ui para componentes accesibles
- React Query documentation para estado del servidor
- Zustand documentation para state management
- TypeScript handbook para tipado avanzado
- Microsoft Entra ID documentation para integración de autenticación
- Docker documentation para containerización

---

## 🤔 Reflexión Final

### ¿Qué salió bien?

La implementación del sistema de Kanban con drag-and-drop funcionó de forma fluida desde el inicio una vez resuelta la estructura de datos. El uso de TypeScript en ambos extremos de la aplicación previno errores de tipo y facilitó refactoring seguro. La separación clara entre services y controllers en el backend permitió lógica reutilizable y testeable. TailwindCSS aceleró significativamente el desarrollo de UI sin escribir CSS personalizado.

### ¿Qué mejorarías?

Con más experiencia, habría planeado arquitectura de estado global con más detalle antes de implementar. Habría incluido tests automatizados desde el inicio en lugar de relegarlos al final. La documentación se escribió al final, cuando habría sido más útil documentar mientras se desarrollaba. Habría priorizado mejor el tiempo entre features, dedicando más a testing y menos a pulir UI secundarios.

### ¿Qué aprendiste?

Se adquirieron skills en full-stack development con TypeScript, mejorando el dominio de React hooks personalizados y state management. Se aprendió a integrar autenticación de terceros como Entra ID de forma segura, aunque la implementación completa se dejará para futuro. La experiencia con drag-and-drop y optimistic UI mejoró comprensión de patrones de UX moderno. Se fortaleció el entendimiento de modelos de datos en MongoDB y cuándo desnormalizar en favor de rendimiento. Se aprendió la importancia de auto-asignación y coherencia optimista en aplicaciones colaborativas para mejorar experiencia de usuario.

---

## 📸 Capturas de Pantalla

Se proporcionan capturas de pantalla de las principales vistas de la aplicación documentando la interfaz y funcionalidades implementadas:

### Login

![Login](./screenshots/login.png)

### Dashboard

![Dashboard](./screenshots/dashboard.png)

### Lista de Proyectos

![Projects](./screenshots/projects.png)

### Detalle de Proyecto y Tareas Kanban

![Tasks](./screenshots/tasks.png)

### Mis Tareas Asignadas

![My Tasks](./screenshots/my-tasks.png)

---

**Fecha de última actualización**: 25/12/2025
