const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config({ debug: true })

app.use('/images', express.static(path.join(__dirname, 'uploads')))

//HTTP request logger middleware for node.js
const morgan = require('morgan');
app.use(morgan('combined', {
    skip: function (req, res) { return res.statusCode < 300 }
}));

// connecting to mongodb
const db = require('./config/db');
db.connect();


//this middleware is to get value for normal form subumit
app.use(express.urlencoded({ extended: true }));
//this middleware is to get value for ajax form subumit
app.use(express.json());

const routes = require('./api/routes/index.routes');
routes(app);
app.use((err, req, res, next) => {
    console.log('Lỗi: ', err)
    res.status(err.status || 500).json({
        error: {
            message: err.message
        }
    });
});

module.exports = app;