const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
        message: 'this is [GET] orders.'
    })
});

router.get('/:orderID', (req, res) => {
    res.status(200).json({
        id: req.params.orderID
    })
});

router.post('/', (req, res) => {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    }

    res.status(201).json({
        message: 'this is [POST] orders.'
    })
});

module.exports = router;