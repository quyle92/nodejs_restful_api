const { barValidator} = require('./validations/barValidator');
const express = require('express');
const router = express.Router();
router.post('/foo',
    barValidator,
    (req, res, next) => {
        res.json('pk')
    }
);