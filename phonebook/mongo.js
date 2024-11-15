// node mongo.js password [name] [number]
import mongoose from 'mongoose'

const password = process.argv[2]
const db_url = `mongodb+srv://Abnormaalz:${password}@cluster0.5jxbu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(db_url).then(() => {
    console.log('connected to MongoDB')
})

const PersonSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', PersonSchema)

const person = new Person({
    name: "Jeroen",
    number: "1234"
})

const fetchAll = () => {
    Person.find({}).then(result => {
        console.log("Phonebook:")
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}

const addPerson = (name, number) => {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    person.save().then(result => {
        console.log(result)
        mongoose.connection.close()
    })
}

if (process.argv.length === 3) {
    fetchAll()
} else if (process.argv.length === 5) {
    addPerson(process.argv[3], process.argv[4])
}