const fs = require("fs");


function fillFileObjects(folderPath, result = [], isRecursive = false) {
    let files = fs.readdirSync(folderPath), filePath = null, fileProp= null;

    files.forEach(file => {
        filePath = `${folderPath}/${file}`;
        fileProp = fs.statSync(filePath);

        if (fileProp.isDirectory()) {
            if (isRecursive) {
                fillFileObjects(filePath, result, true);
            }
        } else {
            result.push(filePath);
        }
    });
}

const lib_map = new Map();
const filePaths = [];

fillFileObjects(__dirname, filePaths, true);

for (let i = 0, ilim = filePaths.length, found = false; i < ilim; ++i) {
    if (!found) {
        if (filePaths[i] === `${__dirname}/index.js`) {
            found = true;
            continue;
        }
    }

    lib_map.set(filePaths[i].split(__dirname)[1], require(filePaths[i]));
}

module.exports = lib_map;