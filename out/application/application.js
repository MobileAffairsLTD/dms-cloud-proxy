"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("../api/errors");
var livelink_entity_controller_1 = require("../controllers/livelink-entity-controller");
var route_1 = require("../api/route");
var alf_controller_1 = require("../controllers/alf/alf-controller");
var express = require("express");
var bodyParser = require("body-parser");
var configuration_1 = require("./configuration");
var auth_1 = require("../api/auth");
var heartbeat_contrroller_1 = require("../controllers/heartbeat-contrroller");
var event_log_1 = require("../utils/event-log");
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
        this._express.use(bodyParser.json({ limit: '5mb', type: 'application/json' }));
        //setup routes
        this.setupRoutes();
        //catch global errors
        this._express.use(errors_1.notFound);
        this._express.use(errors_1.internalServerError);
    };
    Application.prototype.setupRoutes = function () {
        this.configuration = configuration_1.Configuration.load();
        var router = express.Router();
        var liveLinkEntityController = new livelink_entity_controller_1.LiveLinkEntityController(this.configuration);
        var heartbeatController = new heartbeat_contrroller_1.HeartbeatController(this.configuration);
        var alfController = new alf_controller_1.ALFController(this.configuration);
        router.get('/ping', function (req, res, next) {
            res.json({ message: 'pong' });
        });
        router.get('/init', [], route_1.route(auth_1.authApiKey(heartbeatController.downloadCloudConfiguration)));
        router.get('/config', [], route_1.route(auth_1.authApiKey(heartbeatController.getAllConfig)));
        router.patch('/config/:appArea', [], route_1.route(auth_1.authApiKey(heartbeatController.updateConfigAppArea)));
        router.delete('/config/:appArea', [], route_1.route(auth_1.authApiKey(heartbeatController.deleteConfigAppArea)));
        router.delete('/config', [], route_1.route(auth_1.authApiKey(heartbeatController.deleteAllConfig)));
        router.get('/livelink/:appArea/:entity', [], route_1.route(auth_1.authApiKey(liveLinkEntityController.get)));
        router.post('/livelink/:appArea/:entity', [], route_1.route(auth_1.authApiKey(liveLinkEntityController.create)));
        router.patch('/livelink/:appArea/:entity', [], route_1.route(auth_1.authApiKey(liveLinkEntityController.update)));
        router.delete('/livelink/:appArea/:entity', [], route_1.route(auth_1.authApiKey(liveLinkEntityController.delete)));
        router.post('/livelink/:appArea/$command', [], route_1.route(auth_1.authApiKey(liveLinkEntityController.execCommand)));
        router.get('/livelink/:appArea/:entity/$metadata', [], route_1.route(auth_1.authApiKey(liveLinkEntityController.getMetadata)));
        router.post('/plugins/alf/fiscalizationservice/:requestType', [], route_1.route(auth_1.authApiKey(alfController.fiscalizationServiceSubmit)));
        this._express.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        this._express.use('/api', router);
    };
    Application.prototype.run = function () {
        this._express.listen(this.configuration.port);
        event_log_1.EventLog.logInfoStr("Dynamics Mobile Cloud Proxy (c) 2009-2021 www.dynamicsmobile.com, on port " + this.configuration.port);
    };
    return Application;
}());
exports.Application = Application;
//# sourceMappingURL=application.js.map