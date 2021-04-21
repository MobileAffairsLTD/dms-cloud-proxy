"use strict";
exports.__esModule = true;
exports.ApiControlerBase = void 0;
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