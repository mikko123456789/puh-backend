// h 3.9 valmis, työn alla 3.10

const express = require('express')
var morgan = require('morgan')  // logger
const cors = require('cors')
const app = express()

let persons = [
      {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "UKK",
        "number": "007",
        "id": 5
      },
      {
        "name": "Mikko Mäkinen",
        "number": "+358 99 999999",
        "id": 6
      },
      {
        "name": "ukko pekkanen",
        "number": "11 22 345",
        "id": 8
      },
      {
        "name": "Herra X",
        "number": "salainen numero",
        "id": 9
      },
      {
        "name": "Uusi Tyyppi",
        "number": "555-6789",
        "id": 99
      }
]

const infotext = 'Phonebook has info for ' + persons.length + ' people'
const currentdate = new Date()

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

// middleware
app.use(express.json())
// 3.7
app.use(morgan('tiny'))
// 3.9
app.use(cors())

app.set('json spaces', 2)  // epävirallinen kikka, näkyy nätimmin selaimessa, poista tarvittaessa

// routes
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
    console.log(infotext + '\n' + currentdate)
    res.send('<p>' + infotext + '</p><p>' + currentdate + '</p>')
    })

app.get('/api/persons', (req, res) => {
    // console.log(req.headers)
    console.log(`Get persons`)
    res.json(persons)
    })

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id  // voisi olla id = Number(request.params.id), jolloin ei tarvita jatkossa toStringiä, ks. app.delete
    const person = persons.find(person => person.id.toString() === id)
    if(person) {
        console.log(`Get Person ${person.id}`)
        res.json(person)
    } 
    else {
        console.log(`Error: ${id} not found, 404`)
        res.status(404).end()
      }
    })

app.delete('/api/persons/:id', (req, res) => {
    // console.log(req.headers)
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
  })

app.post('/api/persons', (req, res) => {
    
    const person = req.body
    console.log(person)
    
    // const maxId = persons.length > 0
    // ? Math.max(...persons.map(n => n.id)) 
    // : 0

    // 3.8 kesken
    //morgan.token('type', function (req, res) { return JSON.stringify(req.headers['content-type']) })

    person.id = getRandomInt(1,9999999)
    let olijo = false
    if (persons.findIndex(p => p.name === req.body.name) > -1) olijo = true
    console.log(req.body.name, persons.findIndex(p => p.name === req.body.name), olijo)

    persons = persons.concat(person)

    if (!person.name || olijo) {
      console.log('400 name missing or already existing')
      return res.status(400).json({ 
        error: 'name missing or already existing' 
      })
    } else if (!person.number) {
      console.log('400 number missing')
      return res.status(400).json({ 
        error: 'number missing' 
      })
    } else if (persons.indexOf(req.params.name) > -1) {
      console.log('400 name already exists')
      return res.status(400).json({ 
        error: 'name already exists' 
      })      
    } else {
      console.log('New person: ' + JSON.stringify(person))
      res.json(person)
    }
  })

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
