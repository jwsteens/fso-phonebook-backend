import express from "express"
import data from './data.json' assert { type: 'json' }
const app = express()

let persons = data

const getRandomId = () => String(Math.floor(Math.random() * 999999999))

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

app.post('/api/persons', ( request, response ) => {
  const person = request.body
  person.id = getRandomId()

  if (!person.name) return response.status(400).json({ error: "no name was given" })
  if (!person.number) return response.status(400).json({ error: "no number was given" })
  if (persons.find(p => p.name === person.name)) return response.status(409).json({ error: "person with that name is already in phonebook" })
  if (persons.find(p => p.number === person.number)) return response.status(409).json({ error: "person with that number is already in phonebook" })

  persons.push(person)
  response.json(person)
})

const PORT = 80
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))