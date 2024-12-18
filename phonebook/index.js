import express from 'express'
import morgan, { token } from 'morgan'
import cors from 'cors'
import { readFileSync } from 'fs'
import Person from './models/person.js'
const data = JSON.parse(readFileSync('./data.json'))
const app = express()

let persons = data

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

token('json', (req) => {
  // Log the JSON body only for POST requests
  if (req.method === 'POST' && req.body) {
    return JSON.stringify(req.body)
  }
  return ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'))

app.get('/info', ( request, response ) => {
  Person.find({}).then(persons => {
    response.send(`
      <p>Phonebook has information for ${persons.length} people.</p>
      <p>${new Date().toString()}</p>
      `)
  })
})

// API

app.get('/api/persons', ( request, response ) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', ( request, response ) => {
  find({ _id: request.params.id })
  .then(person => {  response.json(person) })
  .catch(error => { response.status(404).end() })
})

app.delete('/api/persons/:id', ( request, response, next ) => {
  Person.findByIdAndDelete(request.params.id)
  .then(result => { 
    if (!result) {
      const error = new Error('Person not found')
      error.name = 'IndexError'
      next(error)
    }
    response.status(204).end()
  })
  .catch(error => next(error))
})

app.post('/api/persons', ( request, response, next ) => {
  const person = new Person({
    name: request.body.name,
    number: request.body.number
  })

  if (!person.name) return response.status(400).json({ error: "no name was given" })
  if (!person.number) return response.status(400).json({ error: "no number was given" })

  person.save()
  .then(savedPerson => { response.json(savedPerson) })
  .catch(error => next(error))
})

app.put('/api/persons/:id', ( request, response, next ) => {
  const person = {
    name: request.body.name,
    number: request.body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
  .then(updatedPerson => response.json(updatedPerson))
  .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === "IndexError") {
    return response.status(404).send({ error: error.message })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

app.listen(process.env.PORT || 3001, () => console.log(`Listening on port ${process.env.PORT || 3001}`))