"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("../errors");
var livelink_entity_create_1 = require("./livelink-entity-create");
//default settings
var default_restAPIPort = 5001;
var express = require("express");
var bodyParser = require("body-parser");
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
    Application.prototype.setupRoutes = function () {
        var router = express.Router();
        router.get('/ping', function (req, res, next) {
            res.json({ message: 'pong' });
        });
        router.get('/livelink/entity', function (req, res, next) {
            var controller = new livelink_entity_create_1.LiveLinkEntityController(req, res);
            controller.get();
        });
        router.post('/livelink/entity', function (req, res, next) {
            var controller = new livelink_entity_create_1.LiveLinkEntityController(req, res);
            controller.create();
        });
        router.patch('/livelink/entity', function (req, res, next) {
            var controller = new livelink_entity_create_1.LiveLinkEntityController(req, res);
            controller.update();
        });
        router.delete('/livelink/entity', function (req, res, next) {
            var controller = new livelink_entity_create_1.LiveLinkEntityController(req, res);
            controller.delete();
        });
        router.post('/livelink/command', function (req, res, next) {
            var controller = new livelink_entity_create_1.LiveLinkEntityController(req, res);
            controller.execCommand();
        });
        this._express.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        this._express.use('/api', router);
    };
    Application.prototype.run = function () {
        this._express.listen(default_restAPIPort);
        console.log("Dynamics Mobile Cloud Proxy (c) 2009-2021 www.dynamicsmobile.com \n -listengin on port " + default_restAPIPort);
    };
    return Application;
}());
exports.Application = Application;
//# sourceMappingURL=application.js.map