const redis = require("../redis-connection");
const Promise = require("bluebird");
const User = require("./User").class;

const mp = new Map();

class RankBoard extends User{
    constructor() {
        super();
    }

    // Cache

    async cacheScoreData(prog) {
        var data = {
            scores: [],
            cardinals: []
        };

        data.scores = await redis.zrevrange(`${prog}:scores`, 0, -1);

        //console.log("data.scores", data.scores);

        if (data.scores.length == 0) {
            return;
        }

        data.cardinals = await Promise.map(data.scores, (score) => {
            return redis.zcard(`${prog}:${score}`);
        }, { concurrency: 1000 });

        if (data.cardinals.length == 0) {
            return;
        }

        for (let i = 0, len = data.cardinals.length; i < len; ++i) {
            let curr_score, prev_score;

            if (i >= 0) {
                curr_score = data.scores[i];
                if (i > 0) {
                    prev_score = data.scores[i - 1];
                }
            }
            
            if (i == 0) {
                data[`${curr_score}:info`] = {
                    rank: 0
                };
                continue;
            }

            data[`${curr_score}:info`] = {
                rank: data[`${prev_score}:info`].rank + data.cardinals[i - 1]
            };
        }

        //delete data.scores;
        //delete data.ranks;

        mp.set(`${prog}:ranks`, data);

        //console.log(`${prog}:ranks`, data);
    }

    async getCacheProgScores(prog) {
        let ranks = mp.get(`${prog}:ranks`);

        if (!ranks) {
            await this.cacheScoreData(prog);
        }

        ranks = mp.get(`${prog}:ranks`);

        if (!ranks) {
            return [-1];
        }

        return ranks.scores;
    }

    async getCacheProgCardinals(prog) {
        let ranks = mp.get(`${prog}:ranks`);

        if (!ranks) {
            await this.cacheScoreData(prog);
        }

        ranks = mp.get(`${prog}:ranks`);

        if (!ranks) {
            return [-1];
        }

        return ranks.cardinals;
    }

    async getCacheProgScoreRank(prog, score) {
        let ranks = mp.get(`${prog}:ranks`);

        if (!ranks) {
            await this.cacheScoreData(prog);
        }

        ranks = mp.get(`${prog}:ranks`);

        if (!ranks) {
            return -1;
        }

        if (!ranks[`${score}:info`]) {
            return -2;
        }

        return ranks[`${score}:info`].rank;
    }

    // Score 

    async removeOldScore(prog, user, score) {
        await redis.zrem(`${prog}:${score}`, `${user}`);
        // let cnt = await redis.zcard(`${prog}:${score}`);
        // if (cnt == 0) {
        //     redis.zrem(`${prog}:scores`, `${score}`);
        // }
    }

    async addNewScore(prog, user, score, date) {
        let pArray = [
            redis.zadd(`${prog}:${score}`, date, `${user}`),
            redis.zadd(`${prog}:scores`, score, `${score}`)
        ];

        await Promise.all(pArray);
    }

    // Ranks

    async getRankInProgScoreBucket(prog, user, score) {
        return await redis.zrank(`${prog}:${score}`, `${user}`);
    }

    async getTopRanks(prog, tops = 100) {
        let all = mp.get(`${prog}:topranks`);
        let ans = [];

        if (!all) return ans;

        for (let i = 0, len = Math.min(tops, all.length); i < len; ++i) {
            ans.push(all[i]);
        }

        return ans;
    }

    async calculateUserRank(prog, user, score) {
        let res;

        if (!score) {
            res = await this.getUserScore(prog, user);
            if (!res.success) {
                return res;
            }
            score = res.score;
        }

        let pArray = [
            this.getCacheProgScoreRank(prog, score),
            this.getRankInProgScoreBucket(prog, user, score)
        ]

        let rArray = await Promise.all(pArray);

        //console.log("rank_of_ascore 1st", user, rArray[0]);

        let rank_of_ascore = rArray[0];

        if (rank_of_ascore < 0) {
            await this.cacheScoreData(prog);
            rank_of_ascore = await this.getCacheProgScoreRank(prog, score);
            
            //console.log("rank_of_ascore 2nd", user, rank_of_ascore);
            
            if (rank_of_ascore < 0) {
                console.log("getCacheProgScoreRank Major Error Code", rank_of_ascore, "score", score);
                return { success: false, message: "cache_rank_of_score_failed" };
            }
        }

        let rank_in_bucket = rArray[1];

        if (rank_in_bucket == undefined || rank_in_bucket == null) {
            console.log("getRankInProgScoreBucket Major Error User", user);
            return { success: false, message: "user_not_found_in_score_bucket" };
        }

        let userRank = 1 + rank_of_ascore + rank_in_bucket;   
        
        //console.log(userRank);

        await this.updateUserRank(prog, user, userRank);
    }

    async updateScoreAndRank(prog, user, delta_score, type = "inc") {

        let date = (new Date()).valueOf();

        if (type !== "dec" && type !== "inc") {
            return { success: false, message: "operation_out_of_bounds" };
        }
        
        let res = await this.getUserScore(prog, user);

        //console.log(res);

        if (!res.success) {
            return res;
        }

        let old_score = res.score;

        if (old_score) {
            await this.removeOldScore(prog, user, old_score);
        }

        //console.log(old_score);

        if (type == "dec") {
            res = await this.decUserScore(prog, user, delta_score);
        } else if (type == "inc") {
            res = await this.incUserScore(prog, user, delta_score);
        }

        //console.log(res);

        if (!res.success) {
            return res;
        }

        let new_score = res.score;

        await this.addNewScore(prog, user, new_score, date);

        return await this.calculateUserRank(prog, user, new_score);
    }

    async calculateTopRanks(prog, topCount = 1000) {

        let prog_scores = await this.getCacheProgScores(prog);
        let prog_cardns = await this.getCacheProgCardinals(prog);

        if (prog_scores[0] < 0) {
            console.log("getCacheProgScores EMPTY", prog_scores[0]);
            return;
        }

        let pArray = [], i = 0, len = prog_scores.length;
        
        while (i < len && topCount > 0) {
            var end;

            if (prog_cardns[i] <= topCount) {
                topCount -= prog_cardns[i];
                end = -1;
            } else {
                end = topCount;
                topCount = 0;
            }

            pArray.push(redis.zrange(`${prog}:${prog_scores[i]}`, 0, end));

            //console.log(prog_scores[i], end);

            ++i;
        }

        let userArray = await Promise.all(pArray);

        let users = [];

        //console.log(userArray);

        for (let i = 0, ilen = userArray.length; i < ilen; ++i) {
            for (let j = 0, jlen = userArray[i].length; j < jlen; ++j) {
                //console.log(i, j, userArray[i][j]);
                users.push(userArray[i][j]);
            }
        }

        //console.log("users", users);

        // let dataArray = await Promise.map(users, (user) => {
        //     return this.getUserData(user);
        // }, { concurrency: 500 });

        mp.set(`${prog}:topranks`, users);
    }

    async lazyUpdateAndGet(prog, user) {
        await this.updateScoreAndRank(prog, user, 0);
        return await this.getUserRank(prog, user);
    }

}

module.exports = {
    getInst: function () {
        return new RankBoard();
    }
};