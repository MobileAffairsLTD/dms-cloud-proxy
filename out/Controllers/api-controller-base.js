"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ApiControlerBase = /** @class */ (function () {
    function ApiControlerBase(configuraiton) {
        this.configuraiton = configuraiton;
    }
    ApiControlerBase.prototype.returnResponseSucces = function (res, obj) {
        res.json(obj);
    };
    ApiControlerBase.prototype.returnResponseError = function (res, httpStatusCode, obj) {
        res.status(httpStatusCode).json(obj);
    };
    return ApiControlerBase;
}());
exports.ApiControlerBase = ApiControlerBase;
//# sourceMappingURL=api-controller-base.js.map