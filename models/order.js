const { default: mongoose } = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema({
    // product: { type: mongoose.Schema.ObjectId, ref: 'Product', required: true },
    // quantity: { type: Number, required: true }
    customer: String,
    orderDetails: [{
        product: { type: mongoose.Schema.ObjectId, ref: 'Product', required: true},
        quantity: { type: Number, required: true }
    }]
});

module.exports = mongoose.model('Order', schema);