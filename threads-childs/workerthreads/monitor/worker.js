const Thread = require('worker_threads');
const nodeThreadCount = require('../../childprocesses/Generic/nodeThreadCount');

console.log(__filename, Thread.workerData);

const processMap = {
    'threadcount': nodeThreadCount
};

(async () => {
    let types = Thread.workerData.types, probes = [], reports, ans = [];

    if (types.length == 0) {
        types = Object.keys(processMap);
    }

    probes = [];

    for (let i = 0, ilen = types.length; i < ilen; ++i) {
        if (processMap[types[i]]) {
            probes.push(processMap[types[i]]());
        }
    }

    try {
        reports = await Promise.allSettled(probes);
    } catch (err) {
        Thread.parentPort.postMessage({success:false, error:err.message});
        return;
    }

    ans = []

    for (let i = 0, ilen = types.length; i < ilen; ++i) {
        if (reports[i].status == 'fulfilled') {
            ans.push({
                success:true, type: types[i], body: reports[i].value
            })
        } else if (reports[i].status == 'rejected') {
            ans.push({
                success: false, type: types[i], error: reports[i].reason
            });
        }
    }

    Thread.parentPort.postMessage({success:true, body: ans});
})();