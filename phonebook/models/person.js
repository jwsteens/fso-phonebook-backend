import dotenv from 'dotenv'
dotenv.config()
import { connect, Schema, model } from 'mongoose'
const url = process.env.MONGODB_URI

console.log('connecting to', url)

connect(url).then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    unique: true
  },
  number: {
    type: String,
    required: true,
    unique: true,
    minLength: 8,
    validate: {
      validator: (v) => {
        return /\d{2,3}-\d{1,}/.test(v)
      },
      message: props => `Phone number must be in the format 'xx-xxxxxx' or 'xxx-xxxxxx' and at least 8 characters long.`
    }
  }
})

personSchema.set('toJSON', { transform: (document, returnedObject) => {
  returnedObject.id = returnedObject._id.toString()
  delete returnedObject._id
  delete returnedObject.__v
}})

export default model('Person', personSchema)