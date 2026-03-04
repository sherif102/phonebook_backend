const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give pasword as argument')
  process.exit(1)
}

const username = 'fullstackopen'
const password = process.argv[2]

const url = `mongodb+srv://${username}:${password}@phonebook.oy83i4l.mongodb.net/?appName=Phonebook`

mongoose.connect(url, { family: 4 })

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Phone = new mongoose.model('Phone', phoneSchema)

if (process.argv.length >= 3) {
  if (!process.argv[3]) {
    Phone.find({}).then(result => {
      console.log('Phonebook:')
      result.forEach(data => console.log(`${data.name} ${data.number}`))
      mongoose.connection.close()
    })
    return
  }
  if (!process.argv[4]) {
    console.log(`cannot save ${process.argv[3]} without number`)
    mongoose.connection.close()
    return
  }

  const name = process.argv[3]
  const number = process.argv[4]

  const phone = new Phone({
    name: name,
    number: number
  })

  phone.save().then(result => {
    // console.log(result)
    mongoose.connection.close()
    console.log(`added ${name} number ${number} to phonebook`)
  })
}