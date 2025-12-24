import dotenv from 'dotenv'
import app from './app'
import { connectDB } from './config/database'

dotenv.config()

const PORT = process.env.PORT

const startServer = async () => {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
      console.log(`API Docs: http://localhost:${PORT}/api-docs`)
      console.log(`Health: http://localhost:${PORT}/health`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Promise Rejection:', err)
  process.exit(1)
})

startServer()
