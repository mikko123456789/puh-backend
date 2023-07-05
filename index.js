// 3.12 valmis: https://puh-backend.onrender.com/
// 3.18* valmis

const express = require('express')
var morgan = require('morgan')  // logger
const cors = require('cors')
require('dotenv').config()
const app = express()

const Person = require('./models/person')

// function getRandomInt(min, max) {
//   min = Math.ceil(min);
//   max = Math.floor(max);
//   return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
// }

// middleware

// 3.11
app.use(express.static('build'))
app.use(express.json())
// 3.7
app.use(morgan('tiny'))
// 3.9
app.use(cors())

app.set('json spaces', 2)

// routes

// tämä korvautuu frontilla
app.get('/', (req, res) => {
    const res_html = '<h1>Hello World!</h1>' +
    '<ul>' + 
      '<li><a href="/">main</a></li>' +
      '<li><a href="/info">info</a></li>' +
      '<li><a href="/api/persons">api persons</a></li>' +
    '</ul>'
    res.send(res_html)
    })

app.get('/info', (req, res) => {
    var infotext, currentdate
    console.log(`Get persons from Mongodb`)
    Person.find({}).then(persons => {
      infotext = 'Phonebook has info for ' + persons.length + ' people'
      currentdate = new Date()
      console.log(infotext + '\n' + currentdate)
      res.send('<p>' + infotext + '</p><p>' + currentdate + '</p>')
    })
    })

app.get('/api/persons', (req, res) => {
    // console.log(req.headers)
    console.log(`Get persons from Mongodb`)
    Person.find({}).then(persons => {
      res.json(persons)
    })
  })

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Person.findById(id)
      .then(person => {
        if (person) {
          res.json(person)
        } else {
          console.log(`Error: ${id} not found, 404`)
          res.status(404).send(`error: "${id} not found", status: "404"`)
        }
      })
      .catch(error => next(error))
      // { console.log(error)
      //   res.status(400).send({ error: 'malformatted id', status: '400' })
      // })
  })

  // vanhaa
    // Person.find({}).then(persons => {
    //   // tämä kannattaisi mongoosella tehdä näin:
    //   // .findById(request.params.id)...
    //   // const person = persons.find(person => person.id.toString() === id)
    //   const person = persons.find(person => person.id === id)
    //   if(person) {
    //       console.log(`Get Person ${person.id}`)
    //       res.json(person)
    //   } 
    //   else {
    //       console.log(`Error: ${id} not found, 404`)
    //       // res.status(404).end()
    //       res.status(404).send(`Error: ${id} not found, 404`)
    //     }
    // })

  app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
  
    const person = {
      name: body.name,
      number: body.number
    }
  
    Person.findByIdAndUpdate(req.params.id, person, { new: true })
      .then(updatedPerson => {
        res.json(updatedPerson)
      })
      .catch(error => next(error))
  })

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
  .then(result => {
    res.status(204).end()
  })
  .catch(error => next(error))

    // vanha
    // console.log(req.headers)
    // const id = Number(req.params.id)
    // persons = persons.filter(person => person.id !== id)
    // res.status(204).end()
  })

app.post('/api/persons', (req, res) => {
    // const person = req.body
    // console.log(req.body)

    // person.id = getRandomInt(1,9999999)
    // let olijo = false
    // if (persons.findIndex(p => p.name === req.body.name) > -1) olijo = true
    // console.log(req.body.name, persons.findIndex(p => p.name === req.body.name), olijo)

    const person = new Person({
      name: req.body.name,
      number: req.body.number
    })

    // console.log(`Get persons from Mongodb`)
    // Person.find({}).then(persons => {
    //   res.json(persons)
    // })

    // persons = persons.concat(person)
    // console.log('new person:', person)
    
    person.save()
    .then(result => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
    })

    // console.log('New person: ' + JSON.stringify(person))
    res.json(person)

  //   if (!person.name || olijo) {
  //     console.log('400 name missing or already existing')
  //     return res.status(400).json({ 
  //       error: 'name missing or already existing' 
  //     })
  //   } else if (!person.number) {
  //     console.log('400 number missing')
  //     return res.status(400).json({ 
  //       error: 'number missing' 
  //     })
  //   } else if (persons.indexOf(req.params.name) > -1) {
  //     console.log('400 name already exists')
  //     return res.status(400).json({ 
  //       error: 'name already exists' 
  //     })      
  //   } else {
  //     console.log('New person: ' + JSON.stringify(person))
  //     res.json(person)
  //   }
  })


// more middleware

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
// olemattomien osoitteiden käsittely
app.use(unknownEndpoint)
  
const errorHandler = (error, request, response, next) => {
  console.log(error.name)
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}
// tämä tulee kaikkien muiden middlewarejen rekisteröinnin jälkeen!
app.use(errorHandler)

// const PORT = 3001
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


// node:
// const http = require('http')
// const app = http.createServer((request, response) => {
// //   response.writeHead(200, { 'Content-Type': 'text/plain' })
// //   response.end('Hello World')
//   response.writeHead(200, { 'Content-Type': 'application/json' })
//   response.end(JSON.stringify(persons, null, 3))
// })
// app.listen(PORT)
// console.log(`Server running on port ${PORT}`)
