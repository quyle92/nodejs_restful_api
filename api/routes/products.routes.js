const express = require('express');
const router = express.Router();
const Product = require('../../models/product');
const { multipleMongooseToObject, mongooseToObject} = require('../../utils/mongoose');
const multer = require('multer')
const upload = require('../../middlwares/uploads/imgUpload');
const multi_upload = upload.array('uploadedImages', 2);

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

router.post('/',(req, res, next) => {
    multi_upload(req, res, function (err) {
        // console.log(req.files);
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            return next(new Error(`Multer uploading error: ${err.message}`));
            // return res.status(500).send({ error: { message: `Multer uploading error: ${err.message}` } }).end();
        } else if (err) {
            // An unknown error occurred when uploading.
            if (err.name == 'ExtensionError') {
                const error = new Error(`ExtensionError: ${err.message}`);
                error.status = 413;
                next(error)
            } else {
                const error = new Error(`Unknown uploading error: ${err.message}`);
                error.status = 500;
                next(error)
            }
        }

        const images = [];
        req.files.forEach((img)=>{
            images.push(img.filename);
        });
        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            images: images
        });

        product.save()
            .then((doc) => {
                res.status(201).json(doc)
            })
            .catch(err => next(err));

    });
});

module.exports = router;