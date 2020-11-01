const Thread = require("worker_threads");
const zipFolder = require("../../childprocesses/Zip/zipFolder");

console.log(__filename, Thread.workerData);

(async () => {
    try {
        let res;
        
        res = await zipFolder(Thread.workerData);
        
        Thread.parentPort.postMessage({ success: true });
    } catch (err) {
        Thread.parentPort.postMessage({ success: false, error: err });
    }
})();