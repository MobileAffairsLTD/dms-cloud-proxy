"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_controller_base_1 = require("./api-controller-base");
const configuration_1 = require("../application/configuration");
const apparea_adapter_1 = require("../adapters/apparea-adapter");
class HeartbeatController extends api_controller_base_1.ApiControlerBase {
    constructor(configuraiton) {
        super(configuraiton);
        this.downloadCloudConfiguration = async (req, res) => {
            //const entityName = req.params.entity;    
            try {
                const request = await apparea_adapter_1.AppAreaAdapter.createRequest({ host: 'api.portal.dynamicsmobile.com', path: '/', headers: { Authorization: '' } });
                this.returnResponseSucces(res, { message: 'dnl config ' });
            }
            catch (err) {
                let message = err.message ? err.message : err;
                try {
                    message = JSON.parse(message);
                }
                catch (err2) {
                    message = err.message ? err.message : err;
                }
                this.returnResponseError(res, 400, message);
            }
        };
        this.deleteAllConfig = (req, res) => {
            const cfg = configuration_1.Configuration.load();
            cfg.appArea = {};
            configuration_1.Configuration.save(cfg);
            this.returnResponseSucces(res, { success: true });
        };
        this.deleteConfigAppArea = (req, res) => {
            if (!req.params.appArea) {
                this.returnResponseError(res, 400, 'Parameter appArea is required');
                return;
            }
            const cfg = configuration_1.Configuration.load();
            delete cfg.appArea[req.params.appArea];
            configuration_1.Configuration.save(cfg);
            this.returnResponseSucces(res, { success: true });
        };
        this.updateConfigAppArea = (req, res) => {
            if (!req.params.appArea) {
                this.returnResponseError(res, 400, 'Parameter appArea is required');
                return;
            }
            try {
                let newSettings;
                if (typeof req.body === 'string')
                    newSettings = JSON.parse(req.body);
                else
                    newSettings = req.body;
                if (!newSettings.backend)
                    throw new Error('Missing property backend from the settings');
                const cfg = configuration_1.Configuration.load();
                if (!cfg.appArea)
                    cfg.appArea = {};
                if (!cfg.appArea[req.params.appArea])
                    cfg.appArea[req.params.appArea] = {};
                if (!cfg.appArea[req.params.appArea].settings)
                    cfg.appArea[req.params.appArea].settings = {};
                cfg.appArea[req.params.appArea].settings.backend = newSettings.backend;
                configuration_1.Configuration.save(cfg);
                this.returnResponseSucces(res, { success: true });
            }
            catch (err) {
                this.returnResponseError(res, 400, err.message ? err.message : err);
            }
        };
        this.getAllConfig = (req, res) => {
            try {
                const cfg = configuration_1.Configuration.load();
                delete cfg.apiKey;
                for (let areaName in cfg.appArea) {
                    delete cfg.appArea[areaName]['apiKey'];
                    if (cfg.appArea[areaName].settings && cfg.appArea[areaName].settings.backend) {
                        delete cfg.appArea[areaName].settings.backend['userName'];
                    }
                    if (cfg.appArea[areaName].settings && cfg.appArea[areaName].settings.backend) {
                        delete cfg.appArea[areaName].settings.backend['password'];
                    }
                }
                this.returnResponseSucces(res, cfg);
            }
            catch (err) {
                this.returnResponseError(res, 400, err.message ? err.message : err);
            }
        };
    }
}
exports.HeartbeatController = HeartbeatController;
//# sourceMappingURL=heartbeat-contrroller.js.map