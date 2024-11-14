import express from "express"
import data from './data.json' assert { type: 'json' }
const app = express()

app.get('/', ( request, response ) => {
  response.send(`<h1>Hello, world!</h1>`)
})

app.get('/api/persons', ( request, response ) => {
  response.json(data)
})

app.get('/info', ( request, response ) => {
  response.send(`
    <p>Phonebook has information for ${data.length} people.</p>
    <p>${new Date().toString()}</p>
    `)
})

const PORT = 80
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))