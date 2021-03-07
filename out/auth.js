"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var configuration_1 = require("./configuration");
var response_builder_1 = require("./response.builder");
var configuration = configuration_1.Configuration.load();
exports.auth = function (func) {
    return function (req, res, next) {
        try {
            if (req.headers['dms-api-key'] === configuration['api-key']) {
                return func(req, res, next);
            }
        }
        catch (e) {
            return res.status(401).send(new response_builder_1.ResponseBuilder().err('Unauthorized'));
        }
        return res.status(401).send(new response_builder_1.ResponseBuilder().err('Unauthorized'));
    };
};
//# sourceMappingURL=auth.js.map