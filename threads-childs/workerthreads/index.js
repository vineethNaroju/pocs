const fs = require("fs");

const files = fs.readdirSync(__dirname);
const mp = new Map();

files.forEach(function (file) {
    if (file == "index.js" || file == "README") {
        return;
    }

    let x = require(`./${file}`);

    mp.set(file, x);
});

module.exports = mp;