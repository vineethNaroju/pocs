"use strict";

const SCHEMANAME = "users";

function loadSchema(mongoose) {
    var template = {
        name: {
            type: String,
            required: true
        },

        emailID: {
            type: String,
            required: true
        },

        createdOn: {
            type: Date,
            default: Date.now
        },

        latitude: {
            type: Number,
            required: true
        },

        longitude: {
            type: Number,
            required: true
        },

        randomTag: {
            type: String
        }
    };

    mongoose.model(SCHEMANAME, new mongoose.Schema(template), SCHEMANAME);
}

module.exports = loadSchema;