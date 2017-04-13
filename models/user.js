var mongoose = require('mongoose')
var validate = require('mongoose-validator')
var uniqueValidator = require('mongoose-unique-validator')
var Schema = mongoose.Schema

const emailValidator = validate({
  validator: 'isEmail',
  passIfEmpty: true,
  message: 'The email is not correct.'
})

const userSchema = new Schema({
  userName: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true,
    dropDups: true,
    required: true,
    validate: emailValidator
  },
  password: {
    type: String,
    required: [true, 'You need to specify a valid password.']
  },
  token: {
    type: String,
    required: [true, 'You need to specify a token.'],
    default: 'undefined'
  }
})

userSchema.plugin(uniqueValidator)
module.exports = mongoose.model('user', userSchema)
