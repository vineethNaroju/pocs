const cp = require("child_process");

function unzipFile(path) {
    return new Promise(function (resolve, reject) {
        let child = cp.spawn("unzip", ["-o", path, "-d", "./unzipped"]);

        child.on("message", function (message, sendHandle) {
            console.log("child received message", message, sendHandle);
        });

        child.on("close", function (code) {
            console.log("child closed with code:", code);
        });
    
        child.on("error", function (err) {
            console.log("child faced error:", err.message);
            reject(err);
        });
    
        child.on("exit", function (code, signal) {
            console.log("child exited with code:", code, " due to signal:", signal);
        });
    
        child.on("disconnect", function () {
            console.log("child disconnected");
        });
        
    });
}

// unzipFile("./demo.zip").then(function (res) {
//     console.log(res);
// }).catch(function (err) {
//     console.log(err);
// });

module.exports = unzipFile;