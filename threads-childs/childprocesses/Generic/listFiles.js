const cp = require("child_process");

function listFiles(input) {
    let srcFolderPath = input.srcFolderPath, dirPath = input.dirPath;

    return new Promise(function (resolve, reject) {
        if (!dirPath) {
            return new Error("incorrect input");
        }
        
        cp.exec(`cd ${srcFolderPath} && find ${dirPath} -type f`, function (err, stdout, stderr) {
            if (err) reject(err.message);
            if (stderr) reject(stderr);
            resolve(stdout);
        });
    });
}

module.exports = listFiles;