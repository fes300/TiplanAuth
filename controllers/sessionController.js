var express = require('express')
var User = require('../models/user')
var _ = require('lodash')
var async = require('async')
var jwt = require('jsonwebtoken')
var encrypter = require('../helpers/encrypter')

var app = module.exports = express()
app.route('/create').post(createSession)

function createSession(req, res) {
  const locals = {}
  async.parallel([
/* ******** first task getUserScheme ************* */
    (callback) => {
      let username
      let type
      let userSearch

      // The POST contains a username
      if (req.body.username) {
        username = req.body.username
        type = 'username'
        userSearch = { username }
      } else if (req.body.email) {
        // The POST contains an email and not an username
        username = req.body.email
        type = 'email'
        userSearch = { email: username }
      } else {
        return res.status(400).send('You must send at least the username or the email')
      }

      locals.userScheme = { username, type, userSearch }
      return callback()
    },

/* ******** second task look for user ************* */
    (callback) => {
      User.findOne(locals.userScheme.userSearch, (err, docs) => {
        if (err) return callback(err)
        locals.user = docs
        return callback()
      })
    },
  ],

/* ******** callback task getUserScheme ************* */
  () => {
    // encrypter.cryptPassword(locals.user.password, function(hash){console.log('encr:', hash)});
    if (!req.body.password) {
      return res.status(400).send('You must send the password')
    }

    if (!locals.user) {
      return res.status(401).send('We can\'t find the user in our database')
    }

    return encrypter.comparePassword(req.body.password, locals.user.password, isAMatch => {
      if (!isAMatch) {
        return res.status(401).send("The username and password don't match")
      }
      return res.status(201).send({
        id_token: createToken(locals.user, process.env.AUTH0_CLIENT_SECRET),
        message: 'welcome! here\'s your token',
      })
    })
  })
}

function createToken(user, secret) {
  const truncated = _.omit(user, 'password')
  const expiration = { expiresIn: 60 * 60 * 5 }
  return jwt.sign(truncated, secret, expiration)
}
