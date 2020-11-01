"use strict";

const fs = require("fs");


function loadSchema(dbManagerInstance) {

    let files = [], dirPath = __dirname, found = false;

    files = fs.readdirSync(dirPath);

    for(let i=0, file; i<files.length; ++i) {

        if(files[i].indexOf(".schema.js") == -1) {
            continue;
        }

        require(`${dirPath}/${files[i]}`)(dbManagerInstance.mongoose);
        dbManagerInstance.debug("loaded schema %s", file);
    }
}

module.exports = {
    init: loadSchema
};