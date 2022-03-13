const User = require('../models/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;

class UserService {
    async checkEmailAvailability(req, res, next) {
        try {
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(422).json({ message: 'Email not available.' })
            } else {
                next()
            }
        } catch (error) {
            next(error)
        }

    }

    bcryptPassword(req, res, next) {
        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
            if (err) return next(err);
            req.hashedPassword = hash;
            next()
        });
    }
}

module.exports = new UserService();