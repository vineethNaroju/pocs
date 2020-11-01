const cp = require("child_process");

// not safe
// due to shell permissions

function unzipFile(path) {
    return new Promise(function (resolve, reject) {
        cp.exec(`unzip ${path} -d ./unzipped`, function (error, stdout, stderr) {
            if (error) reject(error);
            if (stderr) reject(stderr);
            resolve(stdout);
        });
    });
}

module.exports = unzipFile;

// unzipFile("./unzipped").then(function (res) {
//     console.log(res);
// }).catch(function (err) {
//     console.log(err);
// });