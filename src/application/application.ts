import { internalServerError, notFound } from "../api/errors";
import { LiveLinkEntityController } from "../controllers/livelink-entity-controller";
import { route } from '../api/route';
import { ApplicationCommandController } from '../controllers/app-command-controller';



import *  as express from 'express';
import * as bodyParser from 'body-parser';
import { Configuration, ConfigurationObject } from "./configuration";
import { auth } from "../api/auth";
import { HeartbeatController } from "../controllers/heartbeat-contrroller";

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
        this._express.use(bodyParser.json());

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
        const applicationCommandController= new ApplicationCommandController(this.configuration);

        router.get('/ping', (req, res, next): void => {
            res.json({ message: 'pong' })
        });


        router.get('/init', [], route(auth(heartbeatController.downloadCloudConfiguration)));

        router.get('/config', [], route(auth(heartbeatController.getAllConfig)));
        router.patch('/config/:appArea', [], route(auth(heartbeatController.updateConfigAppArea)));
        router.delete('/config/:appArea', [], route(auth(heartbeatController.deleteConfigAppArea)));
        router.delete('/config', [], route(auth(heartbeatController.deleteAllConfig)));


        router.get('/livelink/:appArea/:entity', [], route(auth(liveLinkEntityController.get)));

        router.post('/livelink/:appArea/:entity', [], route(auth(liveLinkEntityController.create)));

        router.patch('/livelink/:appArea/:entity', [], route(auth(liveLinkEntityController.update)));

        router.delete('/livelink/:appArea/:entity', [], route(auth(liveLinkEntityController.delete)));

        router.post('/livelink/:appArea/$command', [], route(auth(liveLinkEntityController.execCommand)));

        router.get('/livelink/:appArea/:entity/$metadata', [], route(auth(liveLinkEntityController.getMetadata)));
                   

        router.post('/application/:appArea/:appCode/:command', [], route(auth(applicationCommandController.execute)));


        this._express.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        })

        this._express.use('/api', router);
    }

    run() {
        this._express.listen(this.configuration.port);
        console.log(`Dynamics Mobile Cloud Proxy (c) 2009-2021 www.dynamicsmobile.com \n -listengin on port ${this.configuration.port}`);
    }


}