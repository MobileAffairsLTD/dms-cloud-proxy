"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_builder_1 = require("./response.builder");
const httpStatus = require("http-status");
exports.notFound = (req, res, next) => {
    if (!res.finished) {
        res.sendStatus(httpStatus.NOT_FOUND);
        res.json(new response_builder_1.ResponseBuilder().err('Requested Resource Not Found'));
        res.end();
    }
};
// handle internal server errors
exports.internalServerError = (err, req, res, next) => {
    if (!res.finished) {
        res.sendStatus(err.status || httpStatus.INTERNAL_SERVER_ERROR);
        res.json(new response_builder_1.ResponseBuilder().err(err.message).setMeta(err.extra));
        res.end();
    }
};
//# sourceMappingURL=errors.js.map