"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configuration_1 = require("../application/configuration");
const response_builder_1 = require("./response.builder");
const jwt_decode_1 = require("jwt-decode");
const configuration = configuration_1.Configuration.load();
exports.authJWT = (func) => {
    return (req, res, next) => {
        try {
            const token = req.headers['authorization'];
            if (!token) {
                throw 'Access denied';
            }
            const authSegments = token.split(';');
            const appArea = authSegments[0].split(':')[1];
            const jwt = authSegments[1];
            const decoded = jwt_decode_1.default(jwt);
            if (decoded.client_id != '1dsi4il7ij4n08bhc24h7vti6l' || decoded.iss != 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_5bRvVxgWj') {
                throw 'Access denied';
            }
            if (!Array.isArray(decoded['cognito:groups'])) {
                throw 'Access denied';
            }
            const role = decoded['cognito:groups'][1];
            const defaultAppCode = decoded['cognito:groups'][2];
            const userType = decoded['cognito:groups'][3];
            const userName = decoded.username;
            const now = new Date();
            if (now.getTime() < decoded.exp) {
                throw 'Access denied';
            }
            return func(req, res, next);
        }
        catch (e) {
            return res.status(401).send(new response_builder_1.ResponseBuilder().err('Unauthorized'));
        }
        return res.status(401).send(new response_builder_1.ResponseBuilder().err('Unauthorized'));
    };
};
exports.authApiKey = (func) => {
    return (req, res, next) => {
        try {
            if (req.headers['dms-api-key'] === configuration.apiKey) {
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