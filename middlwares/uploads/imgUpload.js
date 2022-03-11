const multer = require('multer');
let fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //create folder to save file first (https://stackoverflow.com/a/26815894/11297747).
        fs.mkdirSync('./uploads/' + req.body.name, { recursive: true });

        cb(null, 'uploads/' + req.body.name)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }

})

module.exports = multer({
    storage: storage,
    fileFilter: function fileFilter(req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true)
        } else {
            cb(null, false);
            const err = new Error('Only .png, .jpg and .jpeg format allowed!')
            err.name = 'ExtensionError'
            return cb(err);
        }
    },
});
