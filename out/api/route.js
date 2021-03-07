"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var express_validator_1 = require("express-validator");
var http_status_1 = require("http-status");
var response_builder_1 = require("../../out/response.builder");
var ValidationErrors;
(function (ValidationErrors) {
    ValidationErrors["VALUE_DOES_NOT_EXIST"] = "Value does not exist";
})(ValidationErrors || (ValidationErrors = {}));
var CUSTOM_STATUS_CODES_MAPPING = (_a = {},
    _a[ValidationErrors.VALUE_DOES_NOT_EXIST] = http_status_1.NOT_FOUND,
    _a);
exports.route = function (func) {
    return function (req, res, next) {
        var errors = express_validator_1.validationResult(req);
        var _loop_1 = function (errorKey) {
            var validationErrors = errors.array().filter(function (x) { return x.msg === errorKey; });
            if (validationErrors.length > 0) {
                return { value: res
                        .status(CUSTOM_STATUS_CODES_MAPPING[errorKey])
                        .send(new response_builder_1.ResponseBuilder().err('Validation failed', validationErrors)) };
            }
        };
        /* validate custom status codes errors */
        for (var _i = 0, _a = Object.keys(CUSTOM_STATUS_CODES_MAPPING); _i < _a.length; _i++) {
            var errorKey = _a[_i];
            var state_1 = _loop_1(errorKey);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        /* validate all generic errors */
        if (!errors.isEmpty()) {
            return res
                .status(http_status_1.UNPROCESSABLE_ENTITY)
                .send(new response_builder_1.ResponseBuilder().err('Validation failed', errors.array()));
        }
        /* process function and catch internal server errors */
        func(req, res, next).catch(function (err) {
            res
                .status(err.ERROR_CODE ? err.ERROR_CODE : http_status_1.INTERNAL_SERVER_ERROR)
                .send(new response_builder_1.ResponseBuilder().err(err.toString()));
        });
    };
};
//# sourceMappingURL=route.js.map