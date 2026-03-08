const mongoose = require('mongoose')
mongoose.set('strictQuery', true)

const url = process.env.MONGODB_URI

console.log(`connecting to ${url}`)
mongoose.connect(url, { family: 4 })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const phoneSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function(num) {
        if (num.indexOf('-') === 2 || num.indexOf('-') === 3) {
          return true
        } return false
      },
      message: props => `The minimum length must be 8 and have '-' on the third or fourth index`
    } 
  }
})

phoneSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.__id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Phone', phoneSchema)