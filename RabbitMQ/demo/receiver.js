const MQService = require('./MQService');

const getIST = (date = new Date()) => {
    return new Date(
        date.getTime() + (330 * 60000)
    );
}

const mqPair = [];

mqPair.push({
    name: "aQ",
    consumer: async (data) => {
        console.log(getIST(), `aQ received data:${data}`);
        return Promise.resolve("wooo!");
    }
});

mqPair.push({
    name: "bQ",
    consumer: async (data) => {
        console.log(getIST(), `bQ received data:${data}`);
        return Promise.reject("naaa!");
    }
});


(async () => {

    let mqInst = MQService.getInst();

    for (let i = 0, ilen = mqPair.length; i < ilen; ++i) {
        await mqInst.registerConsumer(mqPair[i].name, mqPair[i].consumer);
    }

    console.log("receiver registered ...");

    return;
})();