const ioredis = require('ioredis');
const redis = new ioredis();
const express = require("express");
const app = express();

const opts = ["a", "b", "c", "d"];

async function voteFor(quesid, optid) {
    let stats = {}, statsMap = {}, sum=0, ratios = [];

    stats = await redis.hgetall(quesid); // {string:string}
    redis.hincrby(quesid, optid, 1);
    
    for(let i=0; i<opts.length; ++i) {
        if(stats[opts[i]]) {
            statsMap[opts[i]] = parseInt(stats[opts[i]]);
        } else {
            statsMap[opts[i]] = 0;
        }
        sum += statsMap[opts[i]];
    }

    ++statsMap[optid];
    ++sum;

    for(let i=0; i<opts.length; ++i) {
        ratios.push({
            id: opts[i],
            ratio: 100 * (statsMap[opts[i]] / sum)
        });
    }

    return ratios;
}


(async () => {

    app.post("/vote", function(req, res) {
        let optid = opts[Math.floor(Math.random() * opts.length)];
        return voteFor(quesid, optid).then(ratios => {
            res.send(ratios);
        }).catch(err => {
            res.send(err);
        });
    });

    app.listen(3421, err => {
        if(err) {
            console.trace(err);
            process.exit(0);
        }
        console.log("server listening on 3421 ...");
    });

    let quesid = "ques1";

    setInterval(async () => {
        let optid = opts[Math.floor(Math.random() * opts.length)];
        await redis.hincrby(quesid, optid, 1);
    }, 10);

    // setInterval(async () => {
    //     let optid = opts[Math.floor(Math.random() * opts.length)];
    //     let ratios = await voteFor(quesid, optid);
    //     console.log("ratios:", ratios);
    // }, 1000);

})();