const userController = require('../../controllers/userController')
const userService = require('../../services/UserService')
const express = require('express');
const router = express.Router();

router.post('/register', userService.checkEmailAvailability, userService.bcryptPassword, userController.register);
router.post('/login', userController.login)

module.exports = router;