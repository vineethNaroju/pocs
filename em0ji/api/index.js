const hookRoutings = require("./hookRoutings");
const express = require("express");

const app = express();

const dirs = [
    `${__dirname}/middleware`,
    `${__dirname}/rest`
];

hookRoutings(app, dirs);

app.listen(4555,  err => {
    if (err) {
        console.log("(╥﹏╥)");
        console.log("error ...\n", err);
    }

    console.log("(⌐ ͡■ ͜ʖ ͡■)");
    console.log("server listening on 4555 ...");
});
