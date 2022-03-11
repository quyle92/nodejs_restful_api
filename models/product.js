const { default: mongoose } = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema({
    name: {type: String, index: {unique: true} },
    price: Number,
    images: { type: [String], index: {unique: true}, required: true}
});

module.exports = mongoose.model('Product', schema);