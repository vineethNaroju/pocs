const cp = require('child_process');

function copyFolder(input) {
    let srcFolderPath = input.srcFolderPath, destFolderPath = input.destFolderPath;

    return new Promise(function (resolve, reject) {
        if (!(srcFolderPath && destFolderPath)) {
            reject('copyFolder incorrect input');
        }

        cp.exec(`cp -r ${srcFolderPath} ${destFolderPath}`, function (err, stdout, stderr) {
            if (err) reject(err.message);
            //if (stderr) reject(stderr);
            resolve(stdout);
        });
    });
}

module.exports = copyFolder;