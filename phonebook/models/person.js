require('dotenv').config()
import { connect, Schema, model } from 'mongoose'
const url = process.env.MONGODB_URI

console.log('connecting to', url)

connect(url).then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new Schema({ name: String, number: String })

personSchema.set('toJSON', { transform: (document, returnedObject) => {
  returnedObject.id = returnedObject._id.toString()
  delete returnedObject._id
  delete returnedObject.__v
}})

export default model('Person', personSchema)