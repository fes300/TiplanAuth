var express = require('express')
var User = require('../models/user')
var _ = require('lodash')
var jwt = require('jsonwebtoken')
var encrypter = require('../helpers/encrypter')

var app = module.exports = express()
app.route('/create').post(createSession)

async function createSession(req, res) {
  const userSearch = req.body.username ? { username: req.body.username } : { email: req.body.email }

  /* ******** check data validity ************* */
  if (userSearch.hasOwnProperty('email') && !userSearch.email) {
    return res.status(400).send('You must send at least the username or the email')
  }
  if (!req.body.password) {
    return res.status(400).send('You must send the password')
  }

/* ******** look for user ************* */
  const user = await User.findOne({ username: req.body.username }, (err, docs) => {
    if (err) {
      return res.status(401).send({
        message: 'We had a technical difficulty, sorry',
        error: err,
      })
    }
    return docs
  })

  if (!user) {
    return res.status(401).send({
      message: 'The user is not registered',
      error: 'the username/mail used is not found in the database.',
    })
  }

  const isAMatch = encrypter.comparePassword(req.body.password, user.password)
  if (!isAMatch) {
    return res.status(401).send({
      message: 'The username and password don\'t match',
      error: 'wrong password.',
    })
  }
  return res.status(201).send({
    id_token: createToken(user, process.env.AUTH_SECRET),
    success: true,
    message: 'welcome! here\'s your token',
  })
}

function createToken(user, secret) {
  const truncated = _.omit(user, 'password')
  const expiration = { expiresIn: 60 * 60 * 5 }
  return jwt.sign(truncated, secret, expiration)
}
