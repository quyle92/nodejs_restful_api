const express = require('express');
const router = express.Router();
const Product = require('../../models/product');
const { multipleMongooseToObject, mongooseToObject} = require('../../utils/mongoose');

const checkAuth = require('../../middlwares/auth');
const productController = require('../../controllers/productController');

router.get('/', (req, res, next) => {
    Product.find()
        .select({ name: 1, price:1, _id:1})
        .exec()
        .then((docs) => {
            if (!docs) res.status(200).json({ message: 'No Products available.' });

            res.jsonSuccess(multipleMongooseToObject(docs));
        })
        .catch(err => {
            next(err)
        })
});

router.get('/:productId', (req, res, next) => {
    Product.findById(req.params.productId).exec()
        .then((doc) => {
            if (!doc) return res.status(404).json({message: 'Product not found.'});
            res.json(doc)
        })
        .catch(err => {
            next(err)
        })
});

router.post('/', checkAuth, productController.store);

module.exports = router;