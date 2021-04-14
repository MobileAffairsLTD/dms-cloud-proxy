import { internalServerError, notFound } from "../api/errors";
import { LiveLinkEntityController } from "../controllers/livelink-entity-controller";
import { route } from '../api/route';
import { ALFController } from '../controllers/alf/alf-controller';
import *  as express from 'express';
import * as bodyParser from 'body-parser';
import { Configuration, ConfigurationObject } from "./configuration";
import { authApiKey, authJWT } from "../api/auth";
import { HeartbeatController } from "../controllers/heartbeat-contrroller";
import { EventLog } from "../utils/event-log";5
import * as swaggerUi from 'swagger-ui-express';
import * as path from 'path';
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./src/swagger.yaml');



const header_APIKEY = 'dms-api-key'
const msg_ApiKeyMissing = 'api-key header is missing in the request'

export class Application {

    private readonly _express: express.Application
    public configuration: ConfigurationObject;
    // private readonly _publisher: DomainEventPublisher
    // private readonly _appServices: Map<string, ApplicationService>;

    constructor() {
        this._express = express();
    }

    init() {


        //exress plugins
        this._express.use(bodyParser.urlencoded({ extended: true }));
        this._express.use(bodyParser.json({ limit: '5mb', type: 'application/json' }));

        //setup routes
        this.setupRoutes();

        //catch global errors
        this._express.use(notFound);
        this._express.use(internalServerError);
    }
    private setupRoutes() {

        this.configuration = Configuration.load();

        const router = express.Router();

        const liveLinkEntityController = new LiveLinkEntityController(this.configuration);
        const heartbeatController = new HeartbeatController(this.configuration);
        const alfController = new ALFController(this.configuration);

        router.get('/ping', (req, res, next): void => {
            res.json({ message: 'pong' })
        });


        router.get('/init', [], route(authApiKey(heartbeatController.downloadCloudConfiguration)));

        router.get('/config', [], route(authApiKey(heartbeatController.getAllConfig)));
        router.patch('/config/:appArea', [], route(authApiKey(heartbeatController.updateConfigAppArea)));
        router.delete('/config/:appArea', [], route(authApiKey(heartbeatController.deleteConfigAppArea)));
        router.delete('/config', [], route(authApiKey(heartbeatController.deleteAllConfig)));


        router.get('/livelink/:appArea/:entity', [], route(authApiKey(liveLinkEntityController.get)));

        router.post('/livelink/:appArea/:entity', [], route(authApiKey(liveLinkEntityController.create)));

        router.patch('/livelink/:appArea/:entity', [], route(authApiKey(liveLinkEntityController.update)));

        router.delete('/livelink/:appArea/:entity', [], route(authApiKey(liveLinkEntityController.delete)));

        router.post('/livelink/:appArea/$command', [], route(authApiKey(liveLinkEntityController.execCommand)));

        router.get('/livelink/:appArea/:entity/$metadata', [], route(authApiKey(liveLinkEntityController.getMetadata)));

        /**
 * @openapi
 * /:
 *   get:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
        router.post('/plugins/alf/request/:appArea/:requestType', [], route(authApiKey(alfController.fiscalizationServiceSubmit)));


        this._express.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        })

        this._express.use('/api', router);

        var options = {
            openapi:'3.0.0',
            explorer: false            
        }


       

        this._express.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument,options));
    }

    run() {
        this._express.listen(this.configuration.port);
        EventLog.logInfoStr(`Dynamics Mobile Cloud Proxy (c) 2009-2021 www.dynamicsmobile.com, on port ${this.configuration.port}`);

    }


}