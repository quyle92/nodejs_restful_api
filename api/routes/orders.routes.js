const express = require('express');
const router = express.Router();
const Order = require('../../models/order');
const Product = require('../../models/product');
const { validateStoreOrderValidator } = require('../../validations/storeOrderValidator');
const { UpdateOrderDetailValidator } = require('../../validations/updateOrderDetailValidator');
const OrderController = require('../../controllers/orderController');
const OrderService = require('../../services/orderService');
const res = require('express/lib/response');
const { param, check, body, validationResult} = require('express-validator');

router.get('/', OrderController.index);

router.get(
    '/:orderId',
    OrderController.show
);

router.post('/',
    validateStoreOrderValidator,
    OrderController.store
);

//add more product to orderDetails array
router.patch(
    '/:orderId',
    UpdateOrderDetailValidator,
    OrderService.getUpdatedOrderDetails,
    OrderController.update
);

module.exports = router;