const fs = require("fs");

function loadRoutings(app, path) {
    let files = fs.readdirSync(path);

    files.forEach(file => {
        file = `${path}/${file}`;
        require(file).init(app);
    });
    
}

module.exports = function (app, dirArray) {
    dirArray.forEach(path => {
        loadRoutings(app, path);
    });
}