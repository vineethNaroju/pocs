'use strict';

const mq = require('amqplib');
const CONFIG_MAX_RETRY_COUNT = 5;

class MQService {
    constructor(config = {}) {
        this.connConfig = {
            host: config.mqURL || 'amqp://localhost',
            username: config.user || 'rabbitmq',
            password: config.pass || 'rabbitmq'
        };

        this.mqCon = null, this.mqChn = null;
        this.prefetchCount = config.prefetchCount || 1;
    }

    async getConnection() {
        if (!this.mqCon) {
            this.mqCon = await mq.connect(this.connConfig);
            if(!this.mqCon) {
                throw new Error("MQService -> getConnection() : mqCon is undefined after connect()");
            }
        }
        return this.mqCon;
    }

    async getChannel() {
        if(!this.mqChn) {
            let conn = await this.getConnection();
            this.mqChn = await conn.createChannel();
            if(!this.mqChn) {
                throw new Error("MQService -> getChannel() : mqChn is undefined after createChannel()");
            }
            this.mqChn.prefetch(this.prefetchCount);
        }
        return this.mqChn;
    }

    async registerConsumer(mqName, mqConsumer) {
        let channel;

        try {
            channel = await this.getChannel();

            await channel.assertQueue(mqName, {
                durable: true
            });

            return channel.consume(mqName, async (msg) => {
                if(msg) {
                    console.log(mqName, msg.properties.headers);

                    let msgString, parsedMsg, sentFlag, maxRetryCount;

                    msgString = msg.content.toString();
                    parsedMsg = JSON.parse(msgString);

                    maxRetryCount = msg.properties.headers.maxRetryCount || 1;

                    try {
                        await mqConsumer(parsedMsg);
                    } catch(e) {
                        if(msg.properties.headers.maxRetryCount > 0) {
                            sentFlag = channel.sendToQueue(mqName, msg.content, {
                                persistent: true,
                                headers: {
                                    maxRetryCount: maxRetryCount - 1
                                }
                            });
                            console.log(`RE-Queued Q:${mqName} sentFlag:${sentFlag} maxRetryCount:${maxRetryCount} msg:${msgString} \n`);
                        } else {
                            console.log(`RE-Queue limit over Q:${mqName} msg:${msgString}`);
                        }
                    }
    
                    return channel.ack(msg);
                }
            });

        } catch(e) {
            console.trace("registerConsumer", e);
        }
    }

    async publishMessage(mqName, msg, maxRetryCount = CONFIG_MAX_RETRY_COUNT) {
        let channel, sentFlag, msgBuffer, msgString;

        try {
            msgString = JSON.stringify(msg);
            msgBuffer = new Buffer.alloc( msgString.length, msgString);

            channel = await this.getChannel();
            await channel.assertQueue(mqName, {
                durable: true
            });

            sentFlag = channel.sendToQueue(mqName, msgBuffer, {
                persistent: true,
                headers: {
                    'maxRetryCount': maxRetryCount
                }
            });

            console.log(`publisMessage Queue:${mqName} sentFlag:${sentFlag} msg:${msgString} \n`);

        } catch(e) {
            console.trace("publishMessage", e);
        }
    }
}

module.exports = {
    getInst: function (config) {
        return new MQService(config);
    }
};