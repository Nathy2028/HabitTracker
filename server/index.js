import express from 'express'
import cors from 'cors'
import { createHabit, deleteHabit, getHabits, updateHabit } from './services/habitsApi.js'

const app = express()
const port = Number(process.env.PORT || 3001)

app.use(cors())
app.use(express.json())

app.get('/api/health', (_request, response) => {
  response.json({ ok: true })
})

app.get('/api/habits', async (_request, response, next) => {
  try {
    response.json(await getHabits())
  } catch (error) {
    next(error)
  }
})

app.post('/api/habits', async (request, response, next) => {
  try {
    response.status(201).json(await createHabit(request.body))
  } catch (error) {
    next(error)
  }
})

app.patch('/api/habits/:id', async (request, response, next) => {
  try {
    response.json(await updateHabit(request.params.id, request.body))
  } catch (error) {
    next(error)
  }
})

app.delete('/api/habits/:id', async (request, response, next) => {
  try {
    await deleteHabit(request.params.id)
    response.status(204).send()
  } catch (error) {
    next(error)
  }
})

app.use((error, _request, response, _next) => {
  console.error(error)
  response.status(500).json({ message: error.message || 'Error interno del servidor' })
})

app.listen(port, () => {
  console.log(`API de hábitos escuchando en http://localhost:${port}`)
})
