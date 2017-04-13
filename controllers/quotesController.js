var express = require('express')
var Quoter = require('../helpers/quoter')

var app = module.exports = express()

app.route('/').get(getQuote)

function getQuote (req, res) {
  const quote = Quoter.getRandomOne()
  res.status(201).send({
    message: quote
  })
}
