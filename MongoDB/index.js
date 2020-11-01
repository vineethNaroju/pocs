"use strict";

const dbManagerInstance = require("./DBmanager").getInstance();


module.exports = {
    init: async () => {
        await dbManagerInstance.init();
    },

    getInstance: () => {
        return dbManagerInstance;
    }
}