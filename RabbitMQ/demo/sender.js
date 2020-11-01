const MQService = require('./MQService');

(async () => {

    let mqInst = MQService.getInst();

    let mqNames = ["aQ", "bQ"];

    let id = 0;

    setInterval(() => {
        id = 1-id;

        var msg = {
            tbh: `to:${mqNames[id]} a dummy message`
        };

        mqInst.publishMessage(mqNames[id], msg);
    }, 3000);


    console.log("sender testing ...");

    return;
})();