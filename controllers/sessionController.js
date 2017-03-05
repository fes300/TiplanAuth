var express = require('express')
var jwt = require('express-jwt')
var User = require('../models/user')
var encrypter = require('../helpers/encrypter')
var tokenizer = require('../helpers/tokenizer')


var app = module.exports = express()
const filter = req => req.path === '/create'

const jwtCheck = jwt({
  secret: process.env.AUTH_SECRET,
}).unless(filter)

app.use(jwtCheck)
app.route('/create').post(createSession)
app.route('/check').get(checkToken)

async function createSession(req, res) {
  const userSearch = req.body.userName ? { userName: req.body.userName } : { email: req.body.email }
  /* ******** check data validity ************* */
  if (userSearch.hasOwnProperty('email') && !userSearch.email) {
    return res.status(206).send({
      message: 'You must specify at least the username or the email',
      error: 'no username/email',
    })
  }
  if (!req.body.password) {
    return res.status(206).send({
      message: 'You must send the password',
      error: 'no password',
    })
  }

/* ******** look for user ************* */
  User.findOne(userSearch, (err, user) => {
    if (err) {
      return res.status(500).send({
        message: 'We had a technical difficulty, sorry',
        error: err,
      })
    }

    if (!user) {
      return res.status(404).send({
        message: 'The user is not registered',
        error: 'the username/mail used is not found in the database.',
      })
    }
    const isAMatch = encrypter.comparePassword(req.body.password, user.password)
    if (!isAMatch) {
      return res.status(404).send({
        message: 'The username and password don\'t match',
        error: 'wrong password.',
      })
    }

    user.token = '' // eslint-disable-line
    user.token = tokenizer.createToken(user) // eslint-disable-line
    user.markModified('token')
    user.markModified('userName')

    user.save(() =>
      res.status(201).send({
        token: user.token,
        success: true,
        userName: user.userName,
        message: 'welcome! here\'s your token',
      })
    )

    return user
  })
}

function checkToken(req, res) {
  res.status(201).send({ validToken: true })
}
