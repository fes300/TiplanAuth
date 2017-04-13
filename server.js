var logger = require('morgan')
var cors = require('cors')
var http = require('http')
var express = require('express')
var errorhandler = require('errorhandler')
var dotenv = require('dotenv')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')

var app = express()
var dbName = process.env.NODE_ENV !== 'production'
  ? `mongodb:${process.env.MONGODB_PORT_27017_TCP_PORT}/api` // mongodb is the alias used in the docker_compose file!
  : `mongodb://${process.env.MONGODB_PORT_27017_TCP_ADDR}:${process.env.MONGODB_PORT_27017_TCP_PORT}/api`

/* express configuration */
dotenv.load()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

app.use((err, req, res, next) => {
  if (err.name === 'StatusError') {
    res.send(err.status, err.message)
  } else {
    next(err)
  }
})

if (process.env.NODE_ENV !== 'production') {
  app.use(logger('dev'))
  app.use(errorhandler())
} else {
  app.use(logger('common'))
}

/* connect to db */
// Use native promises
mongoose.Promise = global.Promise
mongoose.connect(dbName)

/* connect controllers */
app.use('/users', require('./controllers/userController'))
app.use('/sessions', require('./controllers/sessionController'))
app.use('/quotes', require('./controllers/quotesController'))

http.createServer(app).listen(process.env.PORT, (err) => {
  if (err) return console.log(err)
  return console.log(`listening in http://localhost:${process.env.PORT}`)
})
