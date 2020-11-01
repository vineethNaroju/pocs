const BaseModel = require("./base.model.js");
const SCHEMANAME = "users";


class UserModel extends BaseModel {
    constructor(dbManagerInstance) {
        super(dbManagerInstance);
        this.class = UserModel;
        UserModel.modelName = SCHEMANAME;
    }
}

module.exports = UserModel;