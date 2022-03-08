const { default: mongoose } = require("mongoose");

async function connect() {
    await mongoose.connect('mongodb://localhost:27017/nodejs_restful_api');
}

module.exports = { connect }