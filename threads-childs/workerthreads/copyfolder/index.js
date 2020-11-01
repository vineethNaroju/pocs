const Thread = require("worker_threads");

function runWorker(workerData) {
    return new Promise(function (resolve, reject) {

        let worker = new Thread.Worker(`${__dirname}/worker.js`, {
            workerData: workerData
        });

        worker.on("exit", function (code) {
            if (code !== 0) {
                reject(new Error(`${__dirname}/worker.js exited with code ${code}`));
            }
        });

        worker.on("error", reject);

        worker.on("message", resolve);
        
    });
}

module.exports = runWorker;