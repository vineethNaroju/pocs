const rp = require("request-promise");
const URL = "http://localhost:3421/sync_time";


for (let i = 0; i < 3; ++i) {
    rp({ url: URL }).then(res => {
        console.log(i, "res", res);
    }).catch(err => {
        console.log(i, "error", err);
    });
}