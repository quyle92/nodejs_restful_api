const bcrypt = require('bcrypt');
const User = require('../models/user');
var jwt = require('jsonwebtoken');

class UserController {
    register(req, res, next) {
        const user = new User({
            email: req.body.email,
            password: req.hashedPassword
        });

        user.save()
            .then((doc) => {
                res.json(doc)
            })
            .catch(err => next(err));
    }

    async login(req, res, next) {
        try {
            let user = await User.findOne({ email: req.body.email })
            if (!user) res.json({ message: 'Auth failed.' });

            let match = await bcrypt.compare(req.body.password, user.password);
            if(!match) res.json({ message: 'Auth failed.'})
            if (match) {
                let token = jwt.sign({ user: user }, 'shhhhh');
                res.json({ message: 'Login succesfully.' });
            }

        } catch (error) {
            next(error)
        }

    }
}

module.exports = new UserController();