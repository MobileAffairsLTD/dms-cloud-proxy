"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.internalServerError = exports.notFound = void 0;
var response_builder_1 = require("./response.builder");
var httpStatus = require("http-status");
var notFound = function (req, res, next) {
    if (!res.finished) {
        res.sendStatus(httpStatus.NOT_FOUND);
        res.json(new response_builder_1.ResponseBuilder().err('Requested Resource Not Found'));
        res.end();
    }
};
exports.notFound = notFound;
// handle internal server errors
var internalServerError = function (err, req, res, next) {
    if (!res.finished) {
        res.sendStatus(err.status || httpStatus.INTERNAL_SERVER_ERROR);
        res.json(new response_builder_1.ResponseBuilder().err(err.message).setMeta(err.extra));
        res.end();
    }
};
exports.internalServerError = internalServerError;
//# sourceMappingURL=errors.js.map