"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var response_builder_1 = require("./response.builder");
var httpStatus = require("http-status");
exports.notFound = function (req, res, next) {
    if (!res.finished) {
        res.sendStatus(httpStatus.NOT_FOUND);
        res.json(new response_builder_1.ResponseBuilder().err('Requested Resource Not Found'));
        res.end();
    }
};
// handle internal server errors
exports.internalServerError = function (err, req, res, next) {
    if (!res.finished) {
        res.sendStatus(err.status || httpStatus.INTERNAL_SERVER_ERROR);
        res.json(new response_builder_1.ResponseBuilder().err(err.message).setMeta(err.extra));
        res.end();
    }
};
//# sourceMappingURL=errors.js.map