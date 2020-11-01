const amqp = require("amqplib");
var connection = undefined;
const host = "amqp://localhost";
const prefetchCount = 10;

async function init() {

    if (connection) return connection;

    try {
        connection = await amqp.connect(host);
    } catch (err) {
        console.trace("init:",err);
        process.exit(-1);
    }

    return connection;
}

async function publishMessage(q, msg) {
    let conn, channel;

    _msg = new Buffer(JSON.stringify(msg));

    try {
        conn = await init();
        channel = await conn.createChannel();
        await channel.assertQueue(q, { durable: true });
        channel.sendToQueue(q, _msg, { persistent: true });
        //console.log(`sent data:${msg} to queue:${q}`);
        return await channel.close();
    } catch (err) {
        console.trace("publistMessage",err);
    }
}

async function registerConsumer(q, consumer) {
    let conn, channel, _msg;

    try {
        conn = await init();
        channel = await conn.createChannel();
        channel.prefetch(prefetchCount);
        await channel.assertQueue(q, { durable: true });
        return channel.consume(q, async (msg) => {
            if (msg) {
                _msg = JSON.parse(msg.content.toString());

                await consumer(_msg);
                return channel.ack(msg);
            }
        });
    } catch (err) {
        console.trace("registerConsumer", err);
    }
}


(async () => {
    await init();

    await registerConsumer("queue-1", data => {
        console.log(new Date(), `Q:queue-1,data:${data}\n`);
    });

    await publishMessage("queue-1", {
        "customCode": 200,
        "value": "helloworld"
    });

})();

module.exports = {
    init: init,
    publishMessage: publishMessage
};