const cp = require('child_process');

function nodeThreadCount() {
    return new Promise(function (resolve, reject) {
        cp.exec(`ps -eT | grep node | wc -l`, function (err, stdout, stderr) {
            if (err) resolve(err.message);
            //if (stderr) resolve(stderr);
            resolve(stdout.slice(0,-1));
        });
    });
}

module.exports = nodeThreadCount;