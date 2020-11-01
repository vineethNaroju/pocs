const express = require("express");
const app = express();
const fs = require('fs');

const uploadMiddleware = require("./uploadMiddleware");

uploadMiddleware.init(app);

app.post("/upload/a", function (req, res) {
    res.send({
        type: "a",
        file: req.file,
        files: req.files
    });
});

app.post("/upload/b", function (req, res) {
    res.send({
        type: "b",
        file: req.file,
        files: req.files
    });
});


app.post("/buffer", function (req, res, next) {
    let maxFileSize = 1024 * 1024 * 50; // 50MB
    let contentBuffer = [], totalBytesInBuffer = 0;
    let contentType = req.headers['content-type'] || 'application/octet';
    let fileName = req.headers['x-file-name'], primaryKey = req.headers['x-engagement-id'];


    console.log(Object.keys(req.headers));

    if (fileName === '') {
        res.status(400).json({ error: 'file name should be x-file-name' });
    }

    req.on('data', function (chunk) {
        contentBuffer.push(chunk);
        totalBytesInBuffer += chunk.length;

        if (totalBytesInBuffer > maxFileSize) {
            req.pause();
            res.header('Connection', 'close');
            res.status(413).json({ error: `file size should not exceed ${maxFileSize} bytes` });
            req.connection.destroy();
        }
    });

    req.on('aborted', function () {
        contentBuffer = [];
    });

    req.on('end', async function () {
        contentBuffer = Buffer.concat(contentBuffer, totalBytesInBuffer);

        fs.writeFile(`${__dirname}/${primaryKey}_${fileName}`, contentBuffer, function (err) {
            if (err) {
                res.header('Connection', 'close');
                res.status(500).json({ error: err.message });
                req.connection.destroy();
                return;
            } 

            res.status(201).json({ path: `${__dirname}/${primaryKey}_${fileName}`, contentType: contentType });
        });
    });
});

app.post("/xyz", function (req, res) {
    let primaryKey = req.body._id, fileName = req.body.fileName;
    let buffer = new Buffer(req.body.encodedFile, 'base64');
    let savePath = `${__dirname}/${primaryKey}_${fileName}`;

    fs.writeFile(savePath, buffer, function (err) {
        if (err) {
            res.send(500).json({ error: "not saved" });
        } else {
            res.send(200).json({ path: savePath });
        }
    });
});






















app.listen(3421, function (err) {
    if (err) {
        console.log(err);
        process.exit(0);
    }
    console.log("listening on 3421 ...");
});