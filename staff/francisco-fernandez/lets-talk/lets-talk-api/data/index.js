const mongoose = require('mongoose')

const { Message, User } = require('./schemas')

module.exports = {
    Message: mongoose.model('Message', Message),
    User: mongoose.model('User', User)
}