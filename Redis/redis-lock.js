
const OK = 1;

class RedisLockService {

    constructor(loops, timeout) {
        super();
        this.loop = loops;
        this.timeout = timeout;
    }

    async law(key, task, cb, _self) {
        let self = this, perms = null;

        --self.loop;

        if (self.loop < 1) {
            return cb(false);
        }

        perms = await self.redis.setnx(`${key}:lock`, 1);

        if (perms === OK) {
            try {
                await task(_self);
            } catch (e) {
                console.trace(`RedisLockService await task() error : ${e}`);
            } finally {
                await self.redis.del(`${key}:lock`);
                return cb(true);
            }
        } else {
            setTimeout(async () => {
                return self.law(key, task, cb, _self);
            }, self.timeout);
        }

    }

    async lockAndWork(key, task, _self) {
        let self = this;

        return new Promise((resolve, reject) => {
            self.law(key, task, res => {
                return resolve(res);
            }, _self);
        });
    }
    
    
}

module.exports = {
    class: RedisLockService,
    getInst: function (loops = 100, timeout = 10) {
        return new RedisLockService(loops, timeout);
    }
}
