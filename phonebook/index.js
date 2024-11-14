import express from "express"
import data from './data.json' assert { type: 'json' }
const app = express()

app.use(express.json())

app.get('/', ( request, response ) => {
  response.send(`<h1>Hello, world!</h1>`)
})

app.get('/info', ( request, response ) => {
  response.send(`
    <p>Phonebook has information for ${data.length} people.</p>
    <p>${new Date().toString()}</p>
    `)
})

// API

app.get('/api/persons', ( request, response ) => {
  response.json(data)
})

app.get('/api/persons/:id', ( request, response ) => {
  const person = data.find(p => p.id === request.params.id)

  if (!person) return response.status(404).end()
  response.json(person)
})

const PORT = 80
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))