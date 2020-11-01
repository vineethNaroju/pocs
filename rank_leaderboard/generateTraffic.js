const Rank = require("./RankBoard");
const rank = Rank.getInst();
const step = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const prog = "ipl";
const dcsn = ["inc", "dec"];

const LOOPS = 1000;
const BURST = 1000;
const UNIQN = 100000;

const Promise = require("bluebird");

(async () => {

    for (let i = 0; i < LOOPS; ++i) {
        let arr = [];
        
        for (let j = 0; j < BURST; ++j) {
            let itr = i * BURST + j;
            let uid = itr % UNIQN;
            let soc = step[Math.floor(step.length * Math.random())];

            arr.push({
                user: `${uid}..${uid}`,
                itr: itr,
                soc: soc
            });
        }

        await Promise.map(arr, ele => {
            return rank.updateScoreAndRank(prog, ele.user, ele.soc, dcsn[0]);
        }, { concurrency: BURST });
        
        console.log("Loop:", i + 1, "Burst:", BURST, "Done:", (i + 1) * BURST);

    }








})();