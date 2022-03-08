const express = require('express');
const router = express.Router();
const Product = require('../../models/products');

function makeResponse(content, req, hasId) {
    let url = (req.get('host') + req.originalUrl)

    if (!hasId)
        url += content.id;

    return {
        ...content.toObject(),
        request: {
            type: 'GET',
            url: url
        }
    }
}

router.get('/', (req, res, next) => {
    Product.find()
        .select({ name: 1, price:1, _id:1})
        .exec()
        .then((docs) => {
            if (!docs) res.status(200).json({ message: 'No Products available.' });

            const response = {
                count: docs.length,
                products: docs.map(doc => { return makeResponse(doc, req, false); })
            };

            res.status(200).json(response);
        })
        .catch(err => {
            next(err)
        })
});

router.get('/:productId', (req, res, next) => {
    Product.findById(req.params.productId).exec()
        .then((doc) => {
            if (!doc) res.status(404).json({message: 'Product not found.'});

            res.json(doc)
        })
        .catch(err => {
            next(err)
        })
});

router.post('/', (req, res, next) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price
    });

    product.save()
        .then((doc) => {
            res.status(201).json(doc)
        })
        .catch(err => next(err));
});

module.exports = router;