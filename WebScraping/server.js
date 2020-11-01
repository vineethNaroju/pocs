'use strict';

const express = require('express');
const app = express();


app.get('/sync_time', (req, res) => {
    return {date: new Date()};
});

app.get('/somequery', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(3421, err => {
    if(err) {
        console.trace(err);
        process.exit(0);
    }

    console.log('server listening on 3421 ...');
});