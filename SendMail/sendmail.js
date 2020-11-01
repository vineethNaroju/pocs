"use strict";

const NodeMailer = require("nodemailer");
const config = {
    "transporter_config": {
        "service": "gmail", "port": 25, 
        "secure": false,
        "auth": {
            "user": "YOUR@GMAIL",
            "pass": "YOUR@PASS"
        },
        "tls": {
            "rejectUnauthorized": false
        }
    },

    "name": "test mail",
    "email": "YOUR@GMAIL"
};

const Transporter = NodeMailer.createTransport(config.transporter_config);




async function sendMail(data) {
    let status, opts = {
        from: `${config.name} <${config.email}>`,
        to: data.to,
        subject: data.subject,
        html: `<b>${data.message}</b>`,
        attachments: data.attachments || [],
        date: new Date()
    };

    try {
        status = await Transporter.sendMail(opts);
    } catch(err) {
        console.trace(err);
    }

    return status;
}

module.exports = sendMail;