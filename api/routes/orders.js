const express = require('express');
const router = express.Router();
const Order = require('../../models/order');
const Product = require('../../models/product');
const { param, validationResult, check } = require('express-validator');

router.get('/', async (req, res, next) => {
    try {
        const docs = await Order.find({}, ['product', 'quantity']).populate('orderDetails.productId', 'name price id');
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

router.post('/', (req, res, next) => {
    try {
        req.body.orderDetails.forEach(async item => {
            let product = await Product.findById(item.productId);
            if (!product) {
                return res.status(422).json({ message: 'Product not found.' }); s
            }
        })

        const order = new Order(req.body);
        order.save()
            .then((doc) => {
                res.status(201).json(doc)
            })
            .catch(err => next(err))
    } catch (err) {
        next(err)
    }

});

//add more product to orderDetails array
router.patch(
    '/:orderId',
    param('orderId').custom(value => {
        return Order.findById(value).then(product => {
            if (!product) {
                return Promise.reject('Order not found.');
            }
        });
    }),
    //https://express-validator.github.io/docs/wildcards.html
    check('orderDetails.*.productId').exists().isMongoId().custom(productId => {
        return Product.findById(productId).then(product => {
            if (!product) {
                return Promise.reject('Product not found.');
            }
        });
    }),
    async (req, res, next) => {
        try {
            //** https://express-validator.github.io/docs/index.html
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const order = await Order.findById(req.params.orderId);

            let orderDetailsCurrent = order.orderDetails.map(item => item.toObject())
            orderDetailsCurrent.map(item => {
                item.productId = item.productId.toString();
                delete item._id;
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
    },
    async (req, res, next) => {
        //** Update the document orderDetails property */
        try {
            const order = await Order.findOneAndUpdate(
                { _id: req.order._id },
                { orderDetails: req.orderDetailsUpdated },
                { returnDocument: 'after' },
            );
            res.status(200).json(order.toObject())
        } catch (err) {
            next(err)
        }
    }
);

module.exports = router;