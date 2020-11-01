
"use strict";

const debug  = require("debug");
const mongoose = require("mongoose");
const connectionString = require("./connectionString");
const loadSchemas = require("./schemas").init;
const loadModels = require("./models").init;

class DBmanager {

    constructor() {
        this.debug = debug("DBmanager");
        this.mongoose = mongoose;
        this.connection = null
        this.mongoose.set("debug", true);
    }

    getModel(name) {
        return this.connection.model(name);
    }

    async init() {
        this.connection = await this.mongoose.createConnection(connectionString);
        loadSchemas(this);
        loadModels(this);
    }
}

module.exports = {
    getInstance: function() {
        return new DBmanager();
    }
}