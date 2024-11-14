import express from "express"
import data from './data.json' assert { type: 'json' }
const app = express()

app.get('/', ( request, response ) => {
  response.send(`<h1>Hello, world!</h1>`)
})

app.get('/api/persons', ( request, response ) => {
  response.json(data)
})

const PORT = 80
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))