const express = require('express');
const app = express();

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

const routes = require('./api/routes/index');
routes(app);
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    });
});

module.exports = app;