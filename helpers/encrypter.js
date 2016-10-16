'use strict'

var bcrypt = require('bcrypt');

exports.cryptPassword = (password, callback) => {
  console.log('cripting...');
  if(!password)
    return callback(null);

  let hash = bcrypt.hashSync(password, 10);
  return callback(hash);
};

exports.comparePassword = (password, userPassword, callback) => {
  console.log('comparing...');
  var isAMatch = bcrypt.compareSync(password, userPassword);
  return callback(isAMatch);
};
