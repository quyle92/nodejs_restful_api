const Order = require('../models/order');

class OrderSerivce {
    async getUpdatedOrderDetails(req, res, next) {
        try {
            const order = await Order.findById(req.params.orderId, { 'orderDetails._id': 0 });

            let orderDetailsCurrent = order.orderDetails.map(item => item.toObject())
            orderDetailsCurrent.map(item => {
                item.productId = item.productId.toString();
            })

            //** Sum similar keys in an array of objects: https://stackoverflow.com/a/57477448/11297747
            Array.prototype.push.apply(orderDetailsCurrent, req.body.orderDetails);

            const orderDetailsUpdated = Array.from(orderDetailsCurrent.reduce((acc, { quantity, ...r }) => {
                const key = JSON.stringify(r);
                const current = acc.get(key) || { ...r, quantity: 0 };
                return acc.set(key, { ...current, quantity: current.quantity + quantity });
            }, new Map).values());

            req.orderDetailsUpdated = orderDetailsUpdated;
            req.order = order;
            next();

        } catch (err) {
            next(err)
        }
    }
}

module.exports = new OrderSerivce();