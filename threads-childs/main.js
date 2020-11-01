const Thread = require("worker_threads");

function runWorker(workerData) {
    return new Promise(function (resolve, reject) {
        let worker = new Thread.Worker("./worker.js", {
            workerData: workerData
        });

        worker.on("message", function (message) {
            console.log("worker sent message:", message);
        });

        worker.on("error", function (err) {
            console.log("worker faced error:", err.message);
        });
        
        worker.on("exit", function (code) {
            console.log("worker exited with code:", code);
        });
    })
}

runWorker("./unzipped");