const Order = require('../models/order');
const Product = require('../models/product');
const orderService = require('../services/orderService');

class OrderController {
    async index(req, res, next) {
        try {
            const docs = await Order.find({}, ['product', 'quantity']).populate('orderDetails.productId', 'name price id');
            res.status(200).json(docs)
        } catch (error) {
            next(error)
        }
    }

    async show(req, res, next) {
        try {
            const doc = await Order.findById(req.params.orderId, ['product', 'quantity']).populate('orderDetails.productId', 'customer orderDetails');
            res.status(200).json(doc)
        } catch (error) {
            next(error)
        }
    }

    async store(req, res, next) {
        const order = new Order(req.body);
        order.save()
            .then((doc) => {
                res.status(201).json(doc)
            })
            .catch(err => next(err))
    }

    async update(req, res, next) {
        //** Update the document orderDetails property */
        try {
            let order = await Order.findOneAndUpdate(
                { _id: req.order._id },
                { orderDetails: req.orderDetailsUpdated },
                { returnDocument: 'after' },
            );
            order = order.toObject();
            order.itemNmber = order.orderDetails.length;
            res.status(200).json(order)
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new OrderController();
