require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const Phone = require('./models/phones')

const port = process.env.PORT

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'dist')))

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time  ms :body'))

// let notes = [
//   {
//     "name": "James Hutton",
//     "number": "+1 765 8997",
//     "id": "1c64"
//   },
//   {
//     "id": "104b",
//     "name": "Ada Lovelace",
//     "number": "74609-665"
//   },
//   {
//     "id": "6072",
//     "name": "Willey Kanga",
//     "number": "+1-4971163-678"
//   },
//   {
//     "name": "Mellow",
//     "number": "7890098765432",
//     "id": "3b15"
//   },
//   {
//     "id": "1fd3",
//     "name": "Kroos Toni",
//     "number": "+122211"
//   }
// ]

// const App = http.createServer((request, response) => {
//   response.writeHead(200, {'Content-Type': 'application/json'})
//   response.end(JSON.stringify(notes))
// })

app.get('/', (req, res) => {
  const index = 'dist/index.html'
  // res.json(notes)
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
  // res.sendFile(path.resolve('dist'))
})

app.get('/api/persons', (req, res) => {
  Phone.find({}).then(data => res.json(data))
})

app.get('/info', (req, res) => {
  Phone.find({}).then(data => {
    let count = data.length
    const info = `Phonebook has info for ${count} people <br/><br/> ${new Date().toString()}
    `
    res.send(info)
  }) 
})

app.get('/api/persons/:id', (req, res, next) => {
  let id = req.params.id
  console.log(id)
  Phone.findById(id)
    .then(data => {
      if (data) {
        res.json(data)
      } else {
        res.status(404).end()
      }
    }).catch(error => {
      next(error)
    })
})

app.delete('/api/persons/:id', (req, res, next) => {
  let id = req.params.id
  Phone.findByIdAndDelete(id)
    .then(data => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  let id = req.params.id
  Phone.findById(id)
    .then(data => {
      if (data) {
        data.name = req.body.name
        data.number = req.body.number
        res.json(data)
        data.save().then(res.status(201).end())
      } else {
        return res.status(404).send({error: 'data not found'})
      }
    }).catch(error => next(error))
})

app.post('/api/persons/', (req, res, next) => {
  let data = req.body

  if (data.name && data.number) {
    const person = new Phone(data)

    person.save().then(dat => {
      console.log(dat)
      res.status(201)
      res.send(dat.id)
    }).catch(error => next(error))
  } else {
    console.log('invalid data sent')
    res.status(204).end()
  }
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({error: error.message})
  }
  next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`App started on port ${port}`)
})
