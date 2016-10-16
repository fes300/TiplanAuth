var mongoose = require('mongoose'),
     express = require('express'),
        User = require('../models/user'),
           _ = require('lodash'),
       async = require('async'),
         jwt = require('express-jwt');
   encrypter = require('../helpers/encrypter');

var app = module.exports = express.Router();

var jwtCheck = jwt({
  secret: process.env.AUTH0_CLIENT_SECRET,
});

app.use('/', jwtCheck);

app.route('/').get(getUsers);
app.route('/user/:id?').post(addUser).delete(deleteUser);

function getUsers(req, res) {
  User.find({}, 'username',(err, users) => {
    if (err)
      res.send(err);
    else
      res.status(201).json(users);
  });
}

function addUser(req, res) {
  var user = new User(req.body);
  async.parallel(
    [
      (callback)=>{
        if(!req.body.username)
          return callback()

        User.find({username:req.body.username}, function (err, docs) {
          if (err)
            return callback();
          else
            if(docs.length > 0){
              res.status(206).json({
                errors: {
                  already_registered: `${req.body.username} is already registered.`
                }
              });
            } else {
              return callback();
            }
        })
      }
    ],
    () => {
      encrypter.cryptPassword( req.body.password, (hash)=> {
        user.password = hash;
        user.save((err)=>{
          if (err)
            res.status(206).send(err);
          else
            res.status(201).json({message: `${user.username} was successfully added.`, user:user});
        })
      })
    }
  )
}

function deleteUser(req, res) {
  var username = req.body.username;
  User.remove({ username: username }, function (err, removed) {
    if (err)
      res.send(err);
    else
      res.json({username: username});
  });
}
