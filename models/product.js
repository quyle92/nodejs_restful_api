const { default: mongoose } = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema({
    name: {type: String, index: {unique: true} },
    price: Number,
});

module.exports = mongoose.model('Product', schema);