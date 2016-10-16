var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    username: {
      type: String,
      required: [true, 'Why no username?'],
    },
    password: {
      type: String,
      required: [true, 'Why no password?']
    }
});

module.exports = mongoose.model('user', userSchema);
