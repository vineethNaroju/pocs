"use strict";

const fs = require("fs");
const modelMap = new Map();

function loadModels(dbManagerInstance) {

    let files = [], dirPath = __dirname;

    files = fs.readdirSync(dirPath);

    for(let i=0; i<files.length; ++i) {
        if(files[i].indexOf(".model.js") == -1 || files[i] == "base.model.js") {
            continue;
        }

        var ModelClass = require(`${dirPath}/${files[i]}`);
        var modelInstance = new ModelClass(dbManagerInstance);

        modelMap.set(modelInstance.modelName, modelInstance);
    }
}

module.exports = {
    init: (dbManagerInstance) => {
        loadModels(dbManagerInstance);
    },

    getModelInstance: (modelName) => {
        return modelMap.get(modelName);
    }
}