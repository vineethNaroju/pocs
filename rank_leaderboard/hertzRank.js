const Rank = require("./RankBoard");
const rank = Rank.getInst();

const prog = "ipl";
const TOPS = 1000;
const DISP = 10;

(async () => {

    var cah = `${prog}:cache`;
    var rak = `${prog}:topranks`;

    setInterval(async () => {

        console.time(cah);
        await rank.cacheScoreData(prog);
        console.timeEnd(cah);

        console.time(rak);
        await rank.calculateTopRanks(prog, TOPS);
        console.timeEnd(rak);

    }, 1000);


    setInterval(async () => {
        let ans = await rank.getTopRanks(prog, DISP);
        console.log("getTopRanks", ans);
    }, 2000);




})();