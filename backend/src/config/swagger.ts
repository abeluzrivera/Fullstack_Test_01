import swaggerJsdoc from 'swagger-jsdoc'
import { SwaggerDefinition } from 'swagger-jsdoc'

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Project Management API',
    version: '1.0.0',
    description: 'REST API for collaborative project management platform',
    contact: {
      name: 'API Support',
    },
  },
  servers: [
    {
      url:
        process.env.NODE_ENV === 'production'
          ? 'https://api.yourapp.com'
          : `http://localhost:${process.env.PORT || 3000}`,
      description:
        process.env.NODE_ENV === 'production'
          ? 'Production server'
          : 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"',
      },
    },
    schemas: {
      // User Schemas
      User: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            example: '507f1f77bcf86cd799439011',
          },
          name: {
            type: 'string',
            example: 'John Doe',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'john@example.com',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      RegisterRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: {
            type: 'string',
            minLength: 2,
            maxLength: 80,
            example: 'John Doe',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'john@example.com',
          },
          password: {
            type: 'string',
            minLength: 8,
            maxLength: 30,
            example: 'password123',
          },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'john@example.com',
          },
          password: {
            type: 'string',
            example: 'password123',
          },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Login successful',
          },
          data: {
            type: 'object',
            properties: {
              token: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              },
              user: {
                $ref: '#/components/schemas/User',
              },
            },
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            example: 'Error message description',
          },
          errors: {
            type: 'array',
            items: {
              type: 'object',
            },
            description: 'Validation errors if applicable',
          },
        },
      },
      Project: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            example: '507f1f77bcf86cd799439011',
          },
          name: {
            type: 'string',
            example: 'Website Redesign',
          },
          description: {
            type: 'string',
            example: 'Complete redesign of company website',
          },
          owner: {
            type: 'string',
            example: '507f1f77bcf86cd799439011',
          },
          collaborators: {
            type: 'array',
            items: {
              type: 'string',
            },
            example: ['507f1f77bcf86cd799439012', '507f1f77bcf86cd799439013'],
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      CreateProjectRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: {
            type: 'string',
            minLength: 5,
            maxLength: 80,
            example: 'Website Redesign',
          },
          description: {
            type: 'string',
            maxLength: 500,
            example: 'Complete redesign of company website',
          },
        },
      },
      UpdateProjectRequest: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            minLength: 5,
            maxLength: 80,
            example: 'Website Redesign',
          },
          description: {
            type: 'string',
            maxLength: 500,
            example: 'Updated description',
          },
        },
      },
      Task: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            example: '507f1f77bcf86cd799439011',
          },
          title: {
            type: 'string',
            example: 'Design homepage mockup',
          },
          description: {
            type: 'string',
            example: 'Create high-fidelity mockup for homepage',
          },
          project: {
            type: 'string',
            example: '507f1f77bcf86cd799439011',
          },
          assignedTo: {
            type: 'string',
            example: '507f1f77bcf86cd799439012',
          },
          status: {
            type: 'string',
            enum: ['pendiente', 'en progreso', 'completada'],
            example: 'en progreso',
          },
          priority: {
            type: 'string',
            enum: ['baja', 'media', 'alta'],
            example: 'alta',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      CreateTaskRequest: {
        type: 'object',
        required: ['title', 'project'],
        properties: {
          title: {
            type: 'string',
            minLength: 5,
            maxLength: 120,
            example: 'Design homepage mockup',
          },
          description: {
            type: 'string',
            maxLength: 1000,
            example: 'Create high-fidelity mockup for homepage',
          },
          project: {
            type: 'string',
            example: '507f1f77bcf86cd799439011',
          },
          assignedTo: {
            type: 'string',
            example: '507f1f77bcf86cd799439012',
          },
          status: {
            type: 'string',
            enum: ['pendiente', 'en progreso', 'completada'],
            example: 'pendiente',
          },
          priority: {
            type: 'string',
            enum: ['baja', 'media', 'alta'],
            example: 'media',
          },
        },
      },
      UpdateTaskRequest: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            minLength: 5,
            maxLength: 120,
            example: 'Design homepage mockup',
          },
          description: {
            type: 'string',
            maxLength: 1000,
            example: 'Updated description',
          },
          assignedTo: {
            type: 'string',
            example: '507f1f77bcf86cd799439012',
          },
          status: {
            type: 'string',
            enum: ['pendiente', 'en progreso', 'completada'],
            example: 'completada',
          },
          priority: {
            type: 'string',
            enum: ['baja', 'media', 'alta'],
            example: 'alta',
          },
        },
      },
    },
  },
}

const options = {
  definition: swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
}

export const swaggerSpec = swaggerJsdoc(options)
