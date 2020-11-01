const Express = require("express");
const RateLimit = require("express-rate-limit");
//const MongoStore = require("rate-limit-mongo");
const RedisStore = require("rate-limit-redis");
const Redis = require("ioredis");
const RedisClient = new Redis();
const app = Express();

const limiter = RateLimit({
    windowMs: 1000 * 60 * 1,
    max: 10,
    message: {
        success: false,
        message: "too many requests"
    }
    ,
    store: new RedisStore({
        client: RedisClient
    }),
    // store: new MongoStore({
    //     uri: "mongodb://127.0.0.1:27017/RateLimit",
    // })
});

app.use("/sync_time", limiter);

app.get("/sync_time", function (req, res) {
    return res.send({
        success:true,
        date: new Date()
    });
});


app.listen(3421, function (err) {
    if (err) {
        console.log(err);
    }
    console.log("listening on 3421 ...");
});