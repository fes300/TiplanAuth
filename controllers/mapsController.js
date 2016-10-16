'use strict'

var mongoose = require('mongoose'),
     express = require('express'),
           _ = require('lodash'),
       async = require('async'),
         jwt = require('express-jwt'),
        Maps = require('../helpers/maps');

var app = module.exports = express.Router();

var jwtCheck = jwt({
  secret: process.env.AUTH0_CLIENT_SECRET,
});

app.use('/', jwtCheck);

app.route('/').get(getStores);

function getStores(req, res) {
  let radius = parseInt(req.query.radius),
         map = new Maps(`${req.query.lat}, ${req.query.lng}`, req.query.type, radius);

  map.placeSearch(()=>{
    res.status(201).json({
      req: {address: req.query.address, radius: req.query.radius},
      results: map.results,
      errors: map.errors,
      next_page_token: map.next_page_token 
    })
  });
}
