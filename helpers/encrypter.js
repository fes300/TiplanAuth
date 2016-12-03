var bcrypt = require('bcrypt')

exports.cryptPassword = (password) => {
  if (!password) {
    return { error: true, message: 'No password?' }
  }

  if (typeof password !== 'string') {
    return { error: true, message: 'first argument must be a string' }
  }

  return bcrypt.hashSync(password, 10)
}

exports.comparePassword = (password1, password2) => {
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

  return bcrypt.compareSync(password1, password2)
}
