"use strict";

const sdRandom = require("seedrandom");

var redis_key = "abcd";

var fun1 = sdRandom(redis_key, { state: true });

var redis_state = JSON.stringify(fun1.state());


var limit = 1000000; // 10 ^ 6

var _set = new Set();


for (let i = 0, bf = null, af = null; i < limit; ++i) {
    
    bf = _set.size;

    var fun2 = sdRandom(redis_key, { state: JSON.parse(redis_state) });

    _set.add(fun2());

    af = _set.size;

    if (af === bf) {
        console.log(i + 1);
        process.exit(-1);
    }
    
    redis_state = JSON.stringify(fun2.state());
}