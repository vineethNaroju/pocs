const Thread = require('worker_threads');
const copyFolder = require('../../childprocesses/Generic/copyFolder');

console.log(__filename, Thread.workerData);

(async () => {
    try {
        let res = await copyFolder(Thread.workerData);
        Thread.parentPort.postMessage({ success: true });
    } catch (err) {
        Thread.parentPort.postMessage({ success: false, error: err });
    }
})();