var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ApiControlerBase } from "./api-controller-base";
import { Configuration } from "../application/configuration";
import { AppAreaAdapter } from "../adapters/apparea-adapter";
export class HeartbeatController extends ApiControlerBase {
    constructor(configuraiton) {
        super(configuraiton);
        this.downloadCloudConfiguration = (req, res) => __awaiter(this, void 0, void 0, function* () {
            //const entityName = req.params.entity;    
            try {
                const request = yield AppAreaAdapter.createRequest({ host: 'api.portal.dynamicsmobile.com', path: '/', headers: { Authorization: '' } });
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
        });
        this.deleteAllConfig = (req, res) => {
            const cfg = Configuration.load();
            cfg.appArea = {};
            Configuration.save(cfg);
            this.returnResponseSucces(res, { success: true });
        };
        this.deleteConfigAppArea = (req, res) => {
            if (!req.params.appArea) {
                this.returnResponseError(res, 400, 'Parameter appArea is required');
                return;
            }
            const cfg = Configuration.load();
            delete cfg.appArea[req.params.appArea];
            Configuration.save(cfg);
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
                const cfg = Configuration.load();
                if (!cfg.appArea)
                    cfg.appArea = {};
                if (!cfg.appArea[req.params.appArea])
                    cfg.appArea[req.params.appArea] = {};
                if (!cfg.appArea[req.params.appArea].settings)
                    cfg.appArea[req.params.appArea].settings = {};
                cfg.appArea[req.params.appArea].settings.backend = newSettings.backend;
                Configuration.save(cfg);
                this.returnResponseSucces(res, { success: true });
            }
            catch (err) {
                this.returnResponseError(res, 400, err.message ? err.message : err);
            }
        };
        this.getAllConfig = (req, res) => {
            try {
                const cfg = Configuration.load();
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
//# sourceMappingURL=heartbeat-contrroller.js.map