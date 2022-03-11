const productRoutes = require('./products.routes');
const orderRoutes = require('./orders.routes');
const {validationResult } = require('express-validator');

function routes(app) {
    //** Handling CORS
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers','Origin, X-Request-With, Content-Type, Accept, Authorization');
        if(req.method === 'OPTIONS') {
            res.header('CORS Access-Control-Allow-Methods', '*');
            return res.status(200).json({});
        }

        next()
    });

    //** Custome middleware
    app.use(function (req, res, next) {
        //api reponse
        res.jsonSuccess = function (docs) {
            let url = req.get('host') + req.originalUrl;
            docs.map(function (doc) {
                doc.request = {
                    type: 'GET',
                    url: url + doc._id
                }
            });
            return res.status(200).json(docs);
        };

        //** Request validator:
        req.validateRequest = function() {
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return res.status(422).json({ errors: errors.array() });
            //putting next() here  is wrong  as it will jump over to the next top-level middleware (app.use()).
            next();
        }

        next();
    });

    /**
     **========== Route list ====================
     */
    app.use('/products', productRoutes);
    app.use('/orders', orderRoutes);
    /**
    **============= End Route list=================
    */

    //** Handling route not found error.
    app.use((req, res, next) => {
        console.log(' Handling route not found exception')
        const error = new Error('Not Found');
        error.status = 400
        next(error)
    });

}


module.exports = routes;