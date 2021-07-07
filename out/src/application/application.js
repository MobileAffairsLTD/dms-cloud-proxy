"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
var errors_1 = require("../api/errors");
var livelink_entity_controller_1 = require("../controllers/livelink-entity-controller");
var route_1 = require("../api/route");
var alf_controller_1 = require("../controllers/alf/alf-controller");
var express = require("express");
var bodyParser = require("body-parser");
var configuration_1 = require("./configuration");
var auth_1 = require("../api/auth");
var heartbeat_contrroller_1 = require("../controllers/heartbeat-contrroller");
5;
var swaggerUi = require("swagger-ui-express");
var YAML = require('yamljs');
var swaggerDocument = YAML.load('./swagger.yaml');
var https = require("https");
var http = require("http");
var fs = require("fs");
var header_APIKEY = 'dms-api-key';
var msg_ApiKeyMissing = 'api-key header is missing in the request';
var Application = /** @class */ (function () {
    // private readonly _publisher: DomainEventPublisher
    // private readonly _appServices: Map<string, ApplicationService>;
    function Application() {
        this._express = express();
    }
    Application.prototype.init = function () {
        console.log('*** DMS is initializing ...');
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
        /**
 * @openapi
 * /:
 *   get:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
        router.post('/plugins/alf/request/:appArea/:requestType', [], route_1.route(auth_1.authApiKey(alfController.fiscalizationServiceSubmit)));
        this._express.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "*");
            next();
        });
        this._express.use('/api', router);
        var options = {
            openapi: '3.0.0',
            explorer: false
        };
        this._express.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
    };
    Application.prototype.run = function () {
        var me = this;
        if (this.configuration.ssl) {
            if (!fs.existsSync('./ssl/private.pem')) {
                var err = 'ERROR: File ./ssl/private.pem does not exists. Can not start in SSL mode.';
                console.log(err);
                throw new Error(err);
            }
            if (!fs.existsSync('./ssl/certificate.pem')) {
                var err = 'ERROR: File ./ssl/certificate.pem does not exists. Can not start in SSL mode.';
                console.log(err);
            }
            var options = {
                key: fs.readFileSync('./ssl/private.pem'),
                cert: fs.readFileSync('./ssl/certificate.pem'),
            };
            https.createServer(options, this._express).listen(this.configuration.port, function () {
                console.log('*** DMS is listening on SSL port ', me.configuration.port);
            });
        }
        else {
            var options = {};
            http.createServer(options, this._express).listen(this.configuration.port, function () {
                console.log('*** DMS is listening on port ', me.configuration.port);
            });
        }
        //this._express.listen(this.configuration.port);      
        //EventLog.logInfoStr(`Dynamics Mobile Cloud Proxy (c) 2009-2021 www.dynamicsmobile.com, on port ${this.configuration.port}`);
    };
    return Application;
}());
exports.Application = Application;
//# sourceMappingURL=application.js.map