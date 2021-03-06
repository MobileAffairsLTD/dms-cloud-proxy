"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authApiKey = exports.authJWT = void 0;
var configuration_1 = require("../application/configuration");
var response_builder_1 = require("./response.builder");
var jwt_decode_1 = require("jwt-decode");
var configuration = configuration_1.Configuration.load();
var authJWT = function (func) {
    return function (req, res, next) {
        try {
            var token = req.headers['authorization'];
            if (!token) {
                throw 'Access denied';
            }
            var authSegments = token.split(';');
            var appArea = authSegments[0].split(':')[1];
            var jwt = authSegments[1];
            var decoded = jwt_decode_1.default(jwt);
            if (decoded.client_id != '1dsi4il7ij4n08bhc24h7vti6l' || decoded.iss != 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_5bRvVxgWj') {
                throw 'Access denied';
            }
            if (!Array.isArray(decoded['cognito:groups'])) {
                throw 'Access denied';
            }
            var role = decoded['cognito:groups'][1];
            var defaultAppCode = decoded['cognito:groups'][2];
            var userType = decoded['cognito:groups'][3];
            var userName = decoded.username;
            var now = new Date();
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
exports.authJWT = authJWT;
var authApiKey = function (func) {
    return function (req, res, next) {
        var appArea = req.params.appArea;
        if (!configuration) {
            console.log('ERROR: api-key-auth: configuratin object is missing');
            return res.status(401).send(new response_builder_1.ResponseBuilder().err('Unauthorized'));
        }
        if (!configuration.appArea) {
            console.log('ERROR: api-key-auth: configuratin.appArea object is missing');
            return res.status(401).send(new response_builder_1.ResponseBuilder().err('Unauthorized'));
        }
        if (!configuration.appArea[appArea]) {
            console.log("ERROR: api-key-auth: invalid apparea: " + appArea);
            return res.status(401).send(new response_builder_1.ResponseBuilder().err('Unauthorized'));
        }
        var apiKey = configuration.apiKey;
        //support for per-apparea apiKey
        if (appArea) {
            apiKey = configuration.appArea[appArea].apiKey;
            if (!apiKey) {
                //fallback to the primary api key
                apiKey = configuration.apiKey;
            }
        }
        try {
            if (req.headers['dms-api-key'] === apiKey) {
                return func(req, res, next);
            }
        }
        catch (e) {
            return res.status(401).send(new response_builder_1.ResponseBuilder().err('Unauthorized'));
        }
        return res.status(401).send(new response_builder_1.ResponseBuilder().err('Unauthorized'));
    };
};
exports.authApiKey = authApiKey;
//# sourceMappingURL=auth.js.map