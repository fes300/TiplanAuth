'use strict'

var mongoose = require('mongoose'),
     express = require('express'),
        User = require('../models/user'),
        Quoter = require('../quoter'),
           _ = require('lodash'),
       async = require('async'),
         jwt = require('jsonwebtoken'),
       exJwt = require('express-jwt')

var app = module.exports = express.Router();

app.route('/').get(getQuote);

function getQuote(req, res) {
  let quote = Quoter.getRandomOne();
  res.status(201).send({
    message: quote
  });
}
