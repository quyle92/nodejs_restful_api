const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    let authHeader = req.header('authorization');
    if (authHeader.startsWith("Bearer ")) {
        let token = authHeader.substring(7, authHeader.length);
        jwt.verify(token, process.env.JWT_KEY, function (err, decoded) {
            if (err) next(err);

            req.decoded = decoded;
            next()
        });
    } else {
        const error = new Error(`Auth Header Exception: Auth header should start with Bearer: `);
        error.status = 400;
        next(error)
    }

}