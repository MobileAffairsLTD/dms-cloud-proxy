import { ResponseBuilder } from "./response.builder";
import * as httpStatus from 'http-status';
export const notFound = (req, res, next) => {
    if (!res.finished) {
        res.sendStatus(httpStatus.NOT_FOUND);
        res.json(new ResponseBuilder().err('Requested Resource Not Found'));
        res.end();
    }
};
// handle internal server errors
export const internalServerError = (err, req, res, next) => {
    if (!res.finished) {
        res.sendStatus(err.status || httpStatus.INTERNAL_SERVER_ERROR);
        res.json(new ResponseBuilder().err(err.message).setMeta(err.extra));
        res.end();
    }
};
//# sourceMappingURL=errors.js.map