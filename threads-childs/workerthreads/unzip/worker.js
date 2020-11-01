const Thread = require("worker_threads");
const unzipFile = require("../../childprocesses/Zip/unzipFile");

console.log(__filename, Thread.workerData);

(async () => {
    try {
        let res;
        
        res = await unzipFile(Thread.workerData);
        
        Thread.parentPort.postMessage({ success: true });
    } catch (err) {
        Thread.parentPort.postMessage({success:false, error: err});
    }
})();