const cp = require("child_process");

function zipFolder(input) {
    let srcFolderPath = input.srcFolderPath, srcFolderName = input.srcFolderName;
    let destFolderPath = input.destFolderPath, destFileName = input.destFileName ;

    return new Promise(function (resolve, reject) {

        if (!(srcFolderPath && destFolderPath && destFileName)) {
            reject("zipFolder incorrect input");
        }

        cp.exec(`mkdir -p ${destFolderPath} && cd ${srcFolderPath}/.. && zip -r ${destFileName} ./${srcFolderName} && mv ./${destFileName} ${destFolderPath}/${destFileName}`, function (err, stdout, stderr) {
            if (err) reject(err.message);
            if (stderr) reject(stderr);
            resolve(stdout);
        });
    });
}

module.exports = zipFolder;