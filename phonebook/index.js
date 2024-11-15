import express from "express"
import morgan from 'morgan'
import cors from 'cors'
import fs from 'fs'
// import data from './data.json' assert { type: 'json' }
const data = JSON.parse(fs.readFileSync('./data.json'))
const app = express()

let persons = data

const getRandomId = () => String(Math.floor(Math.random() * 999999999))

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('json', (req) => {
  // Log the JSON body only for POST requests
  if (req.method === 'POST' && req.body) {
    return JSON.stringify(req.body)
  }
  return ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'))


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

app.listen(process.env.PORT || 3001, () => console.log(`Listening on port ${process.env.PORT || 3001}`))