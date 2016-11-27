var mongoose = require('mongoose'),
     express = require('express'),
        User = require('../models/user'),
           _ = require('lodash'),
       async = require('async'),
         jwt = require('jsonwebtoken'),
       exJwt = require('express-jwt'),
   encrypter = require('../helpers/encrypter');

var app = module.exports = express.Router();
app.route('/create').post(createSession);

function createSession(req, res) {
  var locals = {};
  async.parallel([
/********* first task getUserScheme **************/
    (callback) => {
        var username,
            type,
            userSearch = {};

        // The POST contains a username and not an email
        if(req.body.username) {
          username = req.body.username;
          type = 'username';
          userSearch = { username: username };
        }
        // The POST contains an email and not an username
        else if(req.body.email) {
          username = req.body.email;
          type = 'email';
          userSearch = { email: username };
        }

        locals.userScheme = {
          username: username,
          type: type,
          userSearch: userSearch
        }
        callback();
      },

/********* second task look for user **************/
    (callback) => {
      User.findOne(locals.userScheme.userSearch, function (err, docs) {
        if (err) return callback(err);
        locals.user = docs;
        callback();
      })
    }
  ],

/********* callback task getUserScheme **************/
  () => {
    // encrypter.cryptPassword(locals.user.password, function(hash){console.log('encr:', hash)});
    if (!locals.userScheme.username || !req.body.password) {
      return res.status(400).send("You must send the username and the password");
    }

    if (!locals.user) {
      return res.status(401).send("We can't find the user in our database");
    }

    encrypter.comparePassword(req.body.password, locals.user.password, function(isAMatch){
      if (!isAMatch) {
        return res.status(401).send("The username and password don't match");
      } else {
        res.status(201).send({
          id_token: createToken(locals.user, process.env.AUTH0_CLIENT_SECRET),
          message: 'welcome! here\'s your token'
        });
      }
    })
  })
};

function createToken(user, secret) {
  truncated = _.omit(user, 'password');
  var expiration = { expiresIn: 60*60*5 };
  return jwt.sign(truncated, secret, expiration);
}

function getUserScheme(req) {

  var username,
      type,
      userSearch = {};

  // The POST contains a username and not an email
  if(req.body.username) {
    username = req.body.username;
    type = 'username';
    userSearch = { username: username };
  }
  // The POST contains an email and not an username
  else if(req.body.email) {
    username = req.body.email;
    type = 'email';
    userSearch = { email: username };
  }

  return {
    username: username,
    type: type,
    userSearch: userSearch
  }
}
