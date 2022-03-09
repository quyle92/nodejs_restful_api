const productRoutes = require('./products');
const orderRoutes = require('./orders');

function routes(app) {
    //handling CORS
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers','Origin, X-Request-With, Content-Type, Accept, Authorization');
        if(req.method === 'OPTIONS') {
            res.header('CORS Access-Control-Allow-Methods', '*');
            return res.status(200).json({});
        }

        next()
    });

    //api response
    app.use(function (req, res, next) {
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

        next();
    });

    /**
     **========== Route list ====================
     */
    app.use('/products', productRoutes);
    app.use('/orders', orderRoutes);

    //handling route not found error.
    app.use((req,res,next) => {
        const error = new Error('Not Found');
        error.status = 400
        next(error)
    });

}


module.exports = routes;