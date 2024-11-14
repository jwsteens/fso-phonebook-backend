import express from "express"
import data from './data.json' assert { type: 'json' }
const app = express()

let persons = data

app.use(express.json())

app.get('/', ( request, response ) => {
  response.send(`<h1>Hello, world!</h1>`)
})

app.get('/info', ( request, response ) => {
  response.send(`
    <p>Phonebook has information for ${persons.length} people.</p>
    <p>${new Date().toString()}</p>
    `)
})

// API

app.get('/api/persons', ( request, response ) => {
  response.json(persons)
})

app.get('/api/persons/:id', ( request, response ) => {
  const person = persons.find(p => p.id === request.params.id)

  if (!person) return response.status(404).end()
  response.json(person)
})

app.delete('/api/persons/:id', ( request, response ) => {
  persons = persons.filter(p => p.id !== request.params.id)
  response.status(204).end()
})

const PORT = 80
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))