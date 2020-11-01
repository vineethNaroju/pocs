
const redis = require("../redis-connection");
const mp = new Map();

class User {
    constructor() {
        this.scoreField = "score";
        this.initFields = ["name"];
    }

    async getUserBasicData(user) {
        var data;

        try {
            data = await redis.hget(user, this.initFields[0]);
        } catch (err) {
            console.log("getUserBasicData error", err);
        }

        return data;
    }

    async getUserData(user) {
        var data;

        try {
            data = await redis.hgetall(user);
        } catch (err) {
            console.log("getUserData error", err);
        }

        return { success: true, data: data };
    }

    async updateUserData(user, body) {
        let pArray = [], rArray;

        this.initFields.forEach(field => {
            if (body.hasOwnProperty(field)) {
                pArray.push(redis.hset(`${user}`, `${field}`, body[field]));
            }
        });

        if (pArray.length == 0) {
            return;
        }

        try {
            rArray = await Promise.all(pArray);
        } catch (err) {
            console.log("updateUserData error", err);
        }
    }

    async getUserScore(prog, user) {
        var score;

        try {
            score = await redis.hget(`${user}`, `${prog}:score`);
        } catch (err) {
            console.log("getUserScore error", err);
            return { success: false, message: "getUserScore error" };
        }

        return { success: true, score: score };
    }

    async incUserScore(prog, user, score) {
        var new_score;

        score = (score < 0) ? (-1 * score) : (score);

        try {
            new_score = await redis.hincrby(`${user}`, `${prog}:score`, score);
        } catch (err) {
            console.log("incUserRank error", err);
            return { success: false, message: "incUserScore error" };
        }

        return { success: true, score: new_score };
    }

    async decUserScore(prog, user, score) {
        var new_score;

        score = (score > 0) ? (-1 * score) : (score);
        
        try {
            new_score = await redis.hincrby(`${user}`, `${prog}:score`, score);
        } catch (err) {
            console.log("decUserScore error", err);
            return { success: false, message: "decUserScore error" };
        }

        return { success: true, score: new_score };
    }

    async updateUserRank(prog, user, rank) {

        try {
            await redis.hset(`${user}`, `${prog}:rank`, rank);
        } catch (err) {
            console.log("updateUserRank error", err);
        }

        return { success: true };
    }

    async getUserRank(prog, user) {
        var rank;

        try {
            rank = await redis.hget(`${user}`, `${prog}:rank`);
        } catch (err) {
            console.log("getUserRank error", err);
        }

        return { success: true, rank: rank };
    }
}

module.exports = {
    class: User,
    getInst: function () {
        return new User();
    }
};