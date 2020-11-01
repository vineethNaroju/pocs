"use strict";

class BaseModel {
    constructor(dbManagerInstance) {
        BaseModel.dbManagerInstance = dbManagerInstance;
    }

    async getModel() {
        return await BaseModel.dbManagerInstance.getModel(this.class.modelName);
    }


}

module.exports = BaseModel;