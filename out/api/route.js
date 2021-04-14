"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const http_status_1 = require("http-status");
const response_builder_1 = require("../../out/response.builder");
var ValidationErrors;
(function (ValidationErrors) {
    ValidationErrors["VALUE_DOES_NOT_EXIST"] = "Value does not exist";
})(ValidationErrors || (ValidationErrors = {}));
const CUSTOM_STATUS_CODES_MAPPING = {
    [ValidationErrors.VALUE_DOES_NOT_EXIST]: http_status_1.NOT_FOUND,
};
exports.route = (func) => {
    return (req, res, next) => {
        const errors = express_validator_1.validationResult(req);
        /* validate custom status codes errors */
        for (const errorKey of Object.keys(CUSTOM_STATUS_CODES_MAPPING)) {
            const validationErrors = errors.array().filter((x) => x.msg === errorKey);
            if (validationErrors.length > 0) {
                return res
                    .status(CUSTOM_STATUS_CODES_MAPPING[errorKey])
                    .send(new response_builder_1.ResponseBuilder().err('Validation failed', validationErrors));
            }
        }
        /* validate all generic errors */
        if (!errors.isEmpty()) {
            return res
                .status(http_status_1.UNPROCESSABLE_ENTITY)
                .send(new response_builder_1.ResponseBuilder().err('Validation failed', errors.array()));
        }
        /* process function and catch internal server errors */
        func(req, res, next).catch((err) => {
            res
                .status(err.ERROR_CODE ? err.ERROR_CODE : http_status_1.INTERNAL_SERVER_ERROR)
                .send(new response_builder_1.ResponseBuilder().err(err.toString()));
        });
    };
};
//# sourceMappingURL=route.js.map