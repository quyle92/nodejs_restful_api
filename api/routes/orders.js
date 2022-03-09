const express = require('express');
const router = express.Router();
const Order = require('../../models/order');
const Product = require('../../models/product');

router.get('/', async (req, res,next) => {
    try {
        const docs = await Order.find({},['product', 'quantity']).populate('product','name price id');
        res.status(200).json(docs)
    } catch (error) {
        next(error)
    }
});

router.get('/:orderID', async (req, res) => {
    try {
        const docs = await Order.findById(req.params.orderID, ['product', 'quantity']).populate('product', 'name price id');
        res.status(200).json(docs)
    } catch (error) {
        next(error)
    }
});

router.post('/', async (req, res, next) => {
    try {
        const product = await Product.findById(req.body.productId);
        if (!product) {
            return res.status(422).json({ message: 'Product not found.' });s
        }
        const order = new Order({
            product: req.body.productId,
            quantity: req.body.quantity
        });
        order.save()
            .then((doc) => {
                res.status(201).json(doc)
            })
            .catch(err => next(err) )

    } catch (err) {
        next(err)
    }

});

module.exports = router;