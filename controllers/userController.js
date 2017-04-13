var express = require('express')
var jwt = require('express-jwt')
var User = require('../models/user')
var encrypter = require('../helpers/encrypter')
var tokenizer = require('../helpers/tokenizer')
var errors = require('../constants/errors.json')

var app = module.exports = express()

const filter = req => req.path === '/user' && req.method === 'POST'

const jwtCheck = jwt({
  secret: process.env.AUTH_SECRET
}).unless(filter)

const userSearchPath = (req) => (req.body.username
  ? { username: req.body.username }
  : { email: req.body.email })

app.use(jwtCheck)

app.route('/')
  .get(getUsers)
app.route('/checkBearer')
  .get(checkBearer)
app.route('/user/:id?')
  .post(addUser)
  .delete(deleteUser)
  .put(updateUser)

function getUsers (req, res) {
  User.find({}, 'username email token', (err, users) => {
    if (err) {
      res.send.status(206).send(err)
    } else {
      res.status(201).json(users)
    }
  })
}

async function addUser (req, res) {
  if (!req.body.username && !req.body.email) {
    return res.status(400).send(errors.noCredentialsError)
  }

  const user = new User(req.body)

  const hash = encrypter.cryptPassword(user.password)
  user.password = hash
  user.token = tokenizer.createToken(user)

  user.save((error) => {
    if (error) return res.status(206).send(error)
    return res.status(201).send({
      message: `${user.username || user.email} was successfully added.`,
      user,
      success: true
    })
  })
}

async function deleteUser (req, res) {
  if (!req.body.username && !req.body.email) {
    return res.status(400).send(errors.noCredentialsError)
  }

  const authorized = await auth(req, res)
  if (!authorized.success) return res.status(401).send(authorized.error)

  const searchPath = userSearchPath(req)
  User.remove(searchPath, (err, removed) => {
    if (err) return res.status(401).send(err)
    return res.status(201).json({
      message: `${searchPath.username || searchPath.email} was successfully deleted`,
      removed,
      success: true
    })
  })
}

async function updateUser (req, res) {
  if (!req.body.username && !req.body.email) {
    return res.status(400).send(errors.noCredentialsError)
  }

  const authorized = await auth(req, res)
  if (!authorized.success) return res.status(401).send(authorized.error)

  const searchPath = userSearchPath(req)
  User.update(searchPath, req.body, (err) => {
    if (err) return res.status(401).send(err)
    return res.status(201).send({
      message: `user ${searchPath.username || searchPath.email} updated correctly`,
      updates: req.body,
      success: true
    })
  })
}

async function checkBearer (req, res) {
  const token = req.headers.authorization.split('Bearer ')[1]
  const requester = await User.findOne({ token }, (err, user) => {
    if (err) return res.status(401).send(err)
    return user
  })
  if (!requester) return { error: errors.bearerNotFound }
  return res.status(201).send(requester)
}

async function auth (req, res) {
  const token = req.headers.authorization.split('Bearer ')[1]
  const requester = await User.findOne({ token }, (err, user) => {
    if (err) return res.status(401).send(err)
    return user
  })

  if (!requester) return { error: errors.bearerNotFound }

  if (req.body.username) {
    return req.body.username === requester.username
      ? { success: true }
      : { error: errors.notAuthorized }
  }
  return req.body.email === requester.email
    ? { success: true }
    : { error: errors.notAuthorized }
}
