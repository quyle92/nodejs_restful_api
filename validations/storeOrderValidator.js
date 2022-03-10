const { check, validationResult } = require('express-validator');
const Product = require('../models/product');


exports.validateStoreOrderValidator = [
    //** https://express-validator.github.io/docs/wildcards.html
    check('orderDetails.*.productId').exists().isMongoId().custom(productId => {
        return Product.findById(productId).then(product => {
            if (!product) {
                return Promise.reject('Product not found.');
            }
        });
    }),
    //** https://express-validator.github.io/docs/index.html
    (req, res, next) => {
        req.validateRequest()
        next();
    },
];

//** Note */
//How to implement validation in a separate file using express-validator :https://stackoverflow.com/questions/55772477/how-to-implement-validation-in-a-separate-file-using-express-validator