import mongoose from 'mongoose'

beforeAll(async () => {
  // Opcional: Conectar a una BD de test si es necesario
})

afterAll(async () => {
  await mongoose.disconnect()
  // Cerrar temporizadores activos
  jest.useRealTimers()
})

afterEach(() => {
  jest.clearAllMocks()
  // Limpiar temporizadores
  jest.clearAllTimers()
})
