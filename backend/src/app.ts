import express, { Application, Request, Response } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './config/swagger'
import authRoutes from './routes/auth.routes'
import entraAuthRoutes from './routes/entra-auth.routes'
import projectRoutes from './routes/project.routes'
import taskRoutes from './routes/task.routes'
import dashboardRoutes from './routes/dashboard.routes'
import userRoutes from './routes/user.routes'
import { errorHandler } from './middleware/errorHandler'
import { authLimiter, apiLimiter } from './middleware/rateLimiter'

const app: Application = express()

app.use(helmet())
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:7898',
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  })
})

app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/auth', authLimiter, entraAuthRoutes)
app.use('/api/projects', apiLimiter, projectRoutes)
app.use('/api/tasks', apiLimiter, taskRoutes)
app.use('/api/dashboard', apiLimiter, dashboardRoutes)
app.use('/api/users', apiLimiter, userRoutes)

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

app.use(errorHandler)

export default app
