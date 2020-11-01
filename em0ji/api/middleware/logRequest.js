module.exports.init = function (app) {
    app.use("/", function (req, res, next) {

        console.log("req.query ...\n", req.query);

        //console.log("req.params ...\n", req.params);
        //console.log("req.body ...\n", req.body);
        return next();
    });
}