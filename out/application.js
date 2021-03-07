"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("./errors");
var livelink_entity_create_1 = require("./Controllers/livelink-entity-create");
var express_validator_1 = require("express-validator");
var route_1 = require("./route");
var express = require("express");
var bodyParser = require("body-parser");
var configuration_1 = require("./configuration");
var auth_1 = require("./auth");
var header_APIKEY = 'dms-api-key';
var msg_ApiKeyMissing = 'api-key header is missing in the request';
var Application = /** @class */ (function () {
    // private readonly _publisher: DomainEventPublisher
    // private readonly _appServices: Map<string, ApplicationService>;
    function Application() {
        this._express = express();
    }
    Application.prototype.init = function () {
        //exress plugins
        this._express.use(bodyParser.urlencoded({ extended: true }));
        this._express.use(bodyParser.json());
        //setup routes
        this.setupRoutes();
        //catch global errors
        this._express.use(errors_1.notFound);
        this._express.use(errors_1.internalServerError);
    };
    Application.prototype.checkApiKey = function () {
        return express_validator_1.check(header_APIKEY, msg_ApiKeyMissing).isEmpty().not().equals(this.configuration["api-key"]);
    };
    Application.prototype.setupRoutes = function () {
        this.configuration = configuration_1.Configuration.load();
        var router = express.Router();
        var liveLinkEntityController = new livelink_entity_create_1.LiveLinkEntityController();
        router.get('/ping', function (req, res, next) {
            res.json({ message: 'pong' });
        });
        router.get('/livelink/entity', [], route_1.route(auth_1.auth(liveLinkEntityController.get)));
        router.post('/livelink/entity', [], route_1.route(auth_1.auth(liveLinkEntityController.create)));
        router.patch('/livelink/entity', [], route_1.route(auth_1.auth(liveLinkEntityController.update)));
        router.delete('/livelink/entity', [], route_1.route(auth_1.auth(liveLinkEntityController.delete)));
        router.post('/livelink/command', [], route_1.route(auth_1.auth(liveLinkEntityController.execCommand)));
        this._express.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        this._express.use('/api', router);
    };
    Application.prototype.run = function () {
        this._express.listen(this.configuration.port);
        console.log("Dynamics Mobile Cloud Proxy (c) 2009-2021 www.dynamicsmobile.com \n -listengin on port " + this.configuration.port);
    };
    return Application;
}());
exports.Application = Application;
//# sourceMappingURL=application.js.map