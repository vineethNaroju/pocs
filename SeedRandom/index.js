"use strict";

const sdRandom = require("seedrandom");

var redis_key = "abcd";

var fun1 = sdRandom(redis_key, { state: true });

var redis_state = JSON.stringify(fun1.state());


var limit = 3;


for (let i = 0; i < limit; ++i) {

    var fun2 = sdRandom(redis_key, { state: JSON.parse(redis_state) });
    
    console.log(fun2());

    redis_state = JSON.stringify(fun2.state());

    console.log(redis_state);
}