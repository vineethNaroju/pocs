const cp = require("child_process");

function unzipFile(input) {
    let srcFilePath = input.srcFilePath, destFolder = input.destFolder;

    return new Promise(function (resolve, reject) {

        if (!(srcFilePath && destFolder)) {
            reject("unzipFile incorrect input");
        }

        cp.exec(`unzip -o ${srcFilePath} -d ${destFolder}`, function (err, stdout, stderr) {
            if (err) reject(err.message);
            if (stderr) reject(stderr);
            resolve(stdout);
        });
    });
}

module.exports = unzipFile;