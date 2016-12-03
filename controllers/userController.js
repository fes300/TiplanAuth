var express = require('express')
var User = require('../models/user')
var async = require('async')
var jwt = require('express-jwt')
var encrypter = require('../helpers/encrypter')

var app = module.exports = express()

var jwtCheck = jwt({
  secret: process.env.AUTH_SECRET,
})

app.use('/', jwtCheck)

app.route('/').get(getUsers)
app.route('/user/:id?').post(addUser).delete(deleteUser)

function getUsers(req, res) {
  User.find({}, 'username', (err, users) => {
    if (err) {
      res.send.status(206).send(err)
    } else {
      res.status(201).json(users)
    }
  })
}

function addUser(req, res) {
  var user = new User(req.body)
  async.parallel(
    [
      callback => {
        if (!req.body.username) return callback()
        return User.find({ username: req.body.username }, (err, docs) => {
          if (err) {
            return callback()
          }

          if (docs.length > 0) {
            return res.status(206).json({
              errors: {
                already_registered: `${req.body.username} is already registered.`,
              },
            })
          }

          return callback()
        })
      },
    ],

    () =>
      encrypter.cryptPassword(req.body.password, (hash) => {
        user.password = hash
        user.save((err) => {
          if (err) return res.status(206).send(err)
          return res.status(201).json({ message: `${user.username} was successfully added.`, user })
        })
      })
  )
}

function deleteUser(req, res) {
  var username = req.body.username
  User.remove({ username }, (err, removed) => {
    if (err) return res.send(err)
    return res.status(201).json({ removed })
  })
}
