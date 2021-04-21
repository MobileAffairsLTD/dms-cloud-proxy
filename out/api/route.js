import { validationResult } from 'express-validator';
import { INTERNAL_SERVER_ERROR, UNPROCESSABLE_ENTITY, NOT_FOUND } from 'http-status';
import { ResponseBuilder } from "./response.builder";
var ValidationErrors;
(function (ValidationErrors) {
    ValidationErrors["VALUE_DOES_NOT_EXIST"] = "Value does not exist";
})(ValidationErrors || (ValidationErrors = {}));
const CUSTOM_STATUS_CODES_MAPPING = {
    [ValidationErrors.VALUE_DOES_NOT_EXIST]: NOT_FOUND,
};
export const route = (func) => {
    return (req, res, next) => {
        const errors = validationResult(req);
        /* validate custom status codes errors */
        for (const errorKey of Object.keys(CUSTOM_STATUS_CODES_MAPPING)) {
            const validationErrors = errors.array().filter((x) => x.msg === errorKey);
            if (validationErrors.length > 0) {
                return res
                    .status(CUSTOM_STATUS_CODES_MAPPING[errorKey])
                    .send(new ResponseBuilder().err('Validation failed', validationErrors));
            }
        }
        /* validate all generic errors */
        if (!errors.isEmpty()) {
            return res
                .status(UNPROCESSABLE_ENTITY)
                .send(new ResponseBuilder().err('Validation failed', errors.array()));
        }
        /* process function and catch internal server errors */
        func(req, res, next).catch((err) => {
            res
                .status(err.ERROR_CODE ? err.ERROR_CODE : INTERNAL_SERVER_ERROR)
                .send(new ResponseBuilder().err(err.toString()));
        });
    };
};
//# sourceMappingURL=route.js.map