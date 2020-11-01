"use strict";

const MongoDB = require("../MongoDB");
const USERS = "users";


const sendMail = require("./sendmail");


async function singleFlow() {
    var dbManager = MongoDB.getInstance();
    var modelInstance = dbManager.getModel(USERS);

    var users = await modelInstance.find({randomTag:"2020-10-18_to_2020-10-19_utc"}, {_id:0});

    var headerBuffer = Buffer("name,emailID,latitude,longitude,\n");
    var bufferArray = [headerBuffer];
    var totalBufferLength = headerBuffer.length;

    for(let i=0; i<users.length; ++i) {
        var str = [
            users[i].name,
            users[i].emailID,
            users[i].latitude,
            users[i].longitude,
            "\n"
        ].join(",");

        var buffer = Buffer(str);

        bufferArray.push(buffer);
        totalBufferLength += buffer.length;
    }

    var totalBuffer = Buffer.concat(bufferArray, totalBufferLength);

    let res = await sendMail({
        to: "TO_SEND@GMAIL.COM",
        subject: "test mail",
        message: "attachment poc test",
        attachments: [
            {
                filename: "testcode.txt",
                path: __dirname + "/test.js"
            },

            {
                filename: "users.csv",
                content: totalBuffer
            }
        ]
    });

    console.log(res);


}


(async () => {

    await MongoDB.init();

    for(let i=0; i<1; ++i) {
        await singleFlow();
    }

})();