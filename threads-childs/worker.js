const Thread = require("worker_threads");
const unzipSpawn = require("./unzipSpawn");
const unzipExec = require("./unzipExec");

console.log(__filename, Thread.workerData);

unzipSpawn(Thread.workerData).then(function (res) {
    console.log("spawn res", res);
}).catch(function (err) {
    console.log("spawn err", err);
});

unzipExec(Thread.workerData).then(function (res) {
    console.log("exec res", res);
}).catch(function (err) {
    console.log("exec err", err);
})