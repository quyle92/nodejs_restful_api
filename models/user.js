const mongoose = require('mongoose');
const { Schema } = mongoose;

const user = new Schema({
    email: { type: String, requied: true, index: { unique: true }, lowercase:true, match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ },
    password: { type: String, requied: true },

});

module.exports = mongoose.model('User', user);