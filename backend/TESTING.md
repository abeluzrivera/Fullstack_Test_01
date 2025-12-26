# Tests del Backend

Este documento describe cómo ejecutar y entender los tests del backend.

## Estructura de Tests

```
tests/
├── controllers/
│   ├── auth.controller.test.ts      # Tests para autenticación
│   ├── project.controller.test.ts   # Tests para proyectos
│   └── task.controller.test.ts      # Tests para tareas
├── middleware/
│   ├── auth.middleware.test.ts      # Tests para middleware de auth
│   └── validation.middleware.test.ts # Tests para validación
├── services/
│   └── auth.service.test.ts         # Tests para servicios de auth
└── setup.ts                          # Configuración global de tests
```

## Ejecución de Tests

### Ejecutar todos los tests

```bash
npm test
```

### Ejecutar tests en modo watch (reinicia con cambios)

```bash
npm run test:watch
```

### Ver cobertura de tests

```bash
npm run test:coverage
```

## Cobertura Actual

Los tests cubren:

### Controllers (auth, project, task)
- Casos exitosos de operaciones CRUD
- Validación de entrada
- Manejo de errores
- Respuestas HTTP apropiadas

### Middleware
- Autenticación con JWT
- Validación de esquemas con Zod
- Manejo de tokens inválidos o expirados
- Casos sin autenticación

### Services
- Generación y verificación de tokens
- Manejo de tokens expirados
- Errores en operaciones

## Próximos Tests a Implementar

1. Tests de integración con base de datos
2. Tests para manejo de errores globales
3. Tests para endpoints completos (E2E)
4. Tests de rendimiento y carga
5. Tests para dashboard service

## Notas

- Los mocks se realizan a nivel de servicios y modelos
- Los tests utilizan Jest como framework de testing
- TypeScript proporciona tipado para mejor calidad de tests
- Todos los tests tienen timeout de 5000ms por defecto
