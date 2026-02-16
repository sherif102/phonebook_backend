// const http = require('http')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const port = 3001

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time  ms :body'))

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})

let notes = [
  {
    "name": "James Hutton",
    "number": "+1 765 8997",
    "id": "1c64"
  },
  {
    "id": "104b",
    "name": "Ada Lovelace",
    "number": "74609-665"
  },
  {
    "id": "6072",
    "name": "Willey Kanga",
    "number": "+1-4971163-678"
  },
  {
    "name": "Mellow",
    "number": "7890098765432",
    "id": "3b15"
  },
  {
    "id": "1fd3",
    "name": "Kroos Toni",
    "number": "+122211"
  }
]

// const App = http.createServer((request, response) => {
//   response.writeHead(200, {'Content-Type': 'application/json'})
//   response.end(JSON.stringify(notes))
// })

app.get('/', (req, res) => {
  res.json(notes)
})

app.get('/info', (req, res) => {
  let count = notes.length
  const info = `Phonebook has info for ${count} people <br/><br/> ${new Date().toString()}
  `

  res.send(info)
})

app.get('/api/persons/:id', (req, res) => {
  let id = req.params.id
  let person = notes.find((note) => note.id == id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  let id = req.params.id
  
  try {
    let person = notes.find((note) => note.id == id)
    notes = notes.filter(note => note.id != person.id)

    // console.log(notes)

    if (person) res.status(200).end()
  } catch {
    res.status(404).end()
  }
})

app.post('/api/persons/', (req, res) => {
  let data = req.body

  if (data.name && data.number) {
    if (notes.find(note => note.name === data.name)) {
      return res.status(409).json({"error": "name must be unique"})
    }

    data['id'] = String(Math.ceil(Math.random() * 100) + 1)

    notes.push(data)
    // console.log(notes)
    console.log(data.id)
    res.status(201)
    res.send(data.id)
    
  } else {
    console.log('invalid data sent')
    res.status(204).end()
  }
})

app.listen(port, () => {
  console.log(`App started on port ${port}`)
})