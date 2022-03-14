const Product = require('../models/product');
const multer = require('multer')
const upload = require('../middlwares/uploads/imgUpload');
const multi_upload = upload.array('uploadedImages', 2);


class productController {
    store(req, res, next) {
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
            req.files.forEach((img) => {
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
    }
}

module.exports = new productController;