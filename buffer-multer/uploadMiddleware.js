const multer = require("multer");

const defaultStorage = multer.memoryStorage();

console.log(defaultStorage);

const attachUpload = (app, multerUpload, path) => {
    app.use(path, (req, res, next) => {
        multerUpload(req, res, err => {
            if (err) {
                console.log("uploadMiddleware", path, err);
                return res.send({
                    success: false,
                    error: err
                });
            }
            next();
        });
    });
};

const aUpload = multer({
    dest: `${__dirname}/uploads`,
    limits: {
        fileSize: 100 * 1000 * 1000 // 100MB
    },
    fileFilter: (req, file, cb) => {
        if (!file) {
            return cb(new Error("file path missing"), false);
        }

        if (file.mimetype !== "application/zip") {
            return cb(new Error("file type not accepted"), false);
        }

        return cb(null, true);
    }
}).single("a");

const bUpload = multer({
    dest: `${__dirname}/uploads`,
    storage: defaultStorage,
    limits: {
        fileSize: 100 * 1000 * 1000 // 100MB
    },
    fileFilter: (req, file, cb) => {
        

        console.log(file);

        return cb(null, true);
    }
}).single("b");

/*
{
  fieldname: 'b',
  originalname: 'assets.zip',
  encoding: '7bit',
  mimetype: 'application/zip'
}
*/






module.exports = {
    init: function (app) {
        attachUpload(app, aUpload, "/upload/a");
        attachUpload(app, bUpload, "/upload/b");
    }
};