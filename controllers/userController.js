var express = require('express')
var jwt = require('express-jwt')
var _ = require('lodash')
var User = require('../models/user')
var encrypter = require('../helpers/encrypter')
var errors = require('../constants/errors.json')

var app = module.exports = express()

var jwtCheck = jwt({
  secret: process.env.AUTH_SECRET,
})

app.use('/', jwtCheck)

app.route('/').get(getUsers)
app.route('/user/:id?')
  .post(addUser)
  .delete(deleteUser)
  .put(updateUser)

function getUsers(req, res) {
  User.find({}, 'username email', (err, users) => {
    if (err) {
      res.send.status(206).send(err)
    } else {
      res.status(201).json(users)
    }
  })
}

async function addUser(req, res) {
  if (!req.body.username && !req.body.email) {
    return res.status(400).send(errors.noCredentialsError)
  }

  const user = new User(req.body)

  const hash = encrypter.cryptPassword(user.password)
  user.password = hash

  user.save((error) => {
    if (error) return res.status(206).send(error)
    return res.status(201).send({
      message: `${user.username || user.email} was successfully added.`,
      user,
      success: true,
    })
  })
}

function deleteUser(req, res) {
  if (!req.body.username && !req.body.email) {
    return res.status(400).send(errors.noCredentialsError)
  }

  const searchPath = userSearchPath(req)

  User.remove(searchPath, (err, removed) => {
    if (err) return res.status(401).send(err)
    return res.status(201).json({
      message: `${searchPath.username || searchPath.email} was successfully deleted`,
      removed,
      success: true,
    })
  })
}

async function updateUser(req, res) {
  if (!req.body.username && !req.body.email) {
    return res.status(400).send(errors.noCredentialsError)
  }

  const searchPath = userSearchPath(req)
  User.update(searchPath, req.body, (err) => {
    if (err) return res.status(401).send(err)
    return res.status(201).send({
      message: `user ${searchPath.username || searchPath.email} updated correctly`,
      updates: req.body,
      success: true,
    })
  })
}

const userSearchPath = (req) => (req.body.username ? { username: req.body.username } : { email: req.body.email })
