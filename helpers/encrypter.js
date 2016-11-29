var bcrypt = require('bcrypt')

exports.cryptPassword = (password, callback) => {
  if (!password) {
    return { error: true, message: 'No password?' }
  }

  if (typeof password !== 'string') {
    return { error: true, message: 'first argument must be a string' }
  }

  const hash = bcrypt.hashSync(password, 10)
  return callback(hash)
}

exports.comparePassword = (password1, password2, callback) => {
  if (!password1) {
    return { error: true, message: 'No password?' }
  }

  if (!password2) {
    return { error: true, message: 'just one password?' }
  }

  if (typeof password1 !== 'string') {
    return { error: true, message: 'first argument must be a string' }
  }

  if (typeof password2 !== 'string') {
    return { error: true, message: 'second argument must be a string' }
  }

  const isAMatch = bcrypt.compareSync(password1, password2)
  return callback(isAMatch)
}
