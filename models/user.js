var mongoose = require('mongoose')
var validate = require('mongoose-validator')
var uniqueValidator = require('mongoose-unique-validator')
var Schema = mongoose.Schema


const validator = validate({
  validator: 'isEmail',
  passIfEmpty: true,
  message: 'The email is not correct.',
})

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    dropDups: true,
    validate: validator,
  },
  password: {
    type: String,
    required: [true, 'You need to specify a valid password.'],
  },
})

userSchema.plugin(uniqueValidator)
module.exports = mongoose.model('user', userSchema)
