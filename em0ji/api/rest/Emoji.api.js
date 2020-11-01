const Emoji = require("../services/Emoji.service");

module.exports.init = function (app) {
    /* GET */

    app.route("/").get((req, res, next) => {
        let serve = Emoji.getInst();
        res.status(200).send(serve.getValue());
    });
    
    app.route("/:msg").get((req, res, next) => {
        let serve = Emoji.getInst();
        res.status(200).send(serve.getValue(req.params.msg));
    });

}