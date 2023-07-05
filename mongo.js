// node mongo.js yourpassword nimi numero
// 3.12 valmis

const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password, (name, number) as argument')
  process.exit(1)
}

const password = process.argv[2]
const newname = process.argv[3]
const newnumber = process.argv[4]
// console.log('argv', process.argv)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})
const Person = mongoose.model('Person', personSchema)

const url = 
  `mongodb+srv://fullstack:${password}@cluster0.k7wl3uz.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
console.log('connecting to mongodb...')

if (process.argv.length > 3) {
    mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
        const person = new Person({
            name: newname,
            number: newnumber
        })
        // console.log('person:', person)
        person.save()
        .then(result => {
            console.log(`added ${newname} number ${newnumber} to phonebook`)
            mongoose.connection.close()
        })})
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
        })
    } else {
        mongoose.connect(url)
        Person
        .find({})
        .then(result => {
            console.log('phonebook:')
            result.forEach(person => {
                console.log(person.name, person.number)
            })
            mongoose.connection.close()
        .catch((error) => {
            console.log('error connecting to MongoDB:', error.message)
          })
        })
}
