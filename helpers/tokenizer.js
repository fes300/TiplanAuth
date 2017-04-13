var _ = require('lodash')
var jwt = require('jsonwebtoken')

exports.createToken = (user, secret = process.env.AUTH_SECRET) => {
  const truncated = _.omit(user, 'password')
  const expiration = { expiresIn: 60 * 60 * 5 }
  return jwt.sign(truncated, secret, expiration)
}
