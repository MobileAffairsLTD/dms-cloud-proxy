"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiControlerBase {
    constructor(configuraiton) {
        this.configuraiton = configuraiton;
    }
    returnResponseSucces(res, obj) {
        res.json(obj);
    }
    returnResponseError(res, httpStatusCode, obj) {
        res.status(httpStatusCode).json(obj);
    }
}
exports.ApiControlerBase = ApiControlerBase;
//# sourceMappingURL=api-controller-base.js.map