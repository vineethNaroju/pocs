const Agenda = require("agenda");
const mongoConnStr = "mongodb://127.0.0.1/agenda";

const agenda = new Agenda({
    "db": { "address": mongoConnStr }
});

//const Q = require("./queue");


function graceful() {
    agenda.stop(() => {
        console.log("graceful agenda stop");
        agenda.cancel({ name: "console_out" });
        console.log("cacelled job");
        process.exit(0);
    });
}

async function scheduleJob(job) {
    const agendaJob = agenda.create(job.name, job.data);
    agendaJob.schedule(job.scheduleAt);

    try {
        await agendaJob.save();
    } catch (err) {
        console.log(err);
    }
}

function defineHandler() {
    agenda.define("console_out", async (job, done) => {
        console.log(new Date(), "console_out:", Object.keys(job));
        // await Q.publishMessage("queue-1", {
        //     "customCode": 200,
        //     "value": "helloworld"
        // });
        return done();
    });

    agenda.define("cancel_console_out", async (job, done) => {
        agenda.cancel({ name: "console_out" });
        console.log(new Date(), "cancel_console_out:", Object.keys(job));
        return done();
    });

}

function getNewDate(currentDate, offsetSeconds) {
    return new Date(currentDate.getTime() + 1000 * offsetSeconds);
}

(async () => {

    //await Q.init();

    process.on("SIGTERM", graceful);
    process.on("SIGINT", graceful);


    agenda.processEvery(3000);

    agenda.on("ready", async () => {
        defineHandler();

        agenda.start();

        await agenda.every("*/1 * * * *", "console_out");

        let job = {
            "name": "cancel_console_out",
            "data": {
                "key": "value"
            },
            "scheduleAt": getNewDate(new Date(), 10)
        };

        //await scheduleJob(job);
    });







})();



// minute [hour] [day/month] [month] [day/week]

// 5 0 * 8 * => At 00:05 in August
// */10 */3 * * * => At every 10th minute after every 3 hours