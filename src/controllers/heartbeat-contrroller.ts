import { ApiControlerBase } from "./api-controller-base";
import { Configuration, ConfigurationObject } from "../application/configuration";
import { AppAreaAdapter } from "../adapters/apparea-adapter";

export class HeartbeatController extends ApiControlerBase {

    constructor(configuraiton: ConfigurationObject) {
        super(configuraiton);
    }

    downloadCloudConfiguration = async (req, res): Promise<any> => {

        try {
            const request = await AppAreaAdapter.createRequest({ host: 'api.portal.dynamicsmobile.com', path: '/', headers: { Authorization: '' } });
            this.returnResponseSucces(res, { message: 'dnl config ' })

        }
        catch (err) {
            let message = err.message ? err.message : err;
            try {
                message = JSON.parse(message);
            }
            catch (err2) {
                message = err.message ? err.message : err;
            }
            this.returnResponseError(res, 400, message)
        }
    }

    deleteAllConfig = (req, res): any => {
        const cfg = Configuration.load();
        cfg.appArea = {};
        Configuration.save(cfg);
        this.returnResponseSucces(res, { success: true });
    }


    deleteConfigAppArea = (req, res): any => {
        if (!req.params.appArea) {
            this.returnResponseError(res, 400, 'Parameter appArea is required');
            return;
        }
        const cfg = Configuration.load();
        delete cfg.appArea[req.params.appArea]
        Configuration.save(cfg);
        this.returnResponseSucces(res, { success: true });
    }

    updateConfigAppArea = (req, res): any => {
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

            if(!newSettings.backend)
                throw new Error('Missing property backend from the settings');    

            const cfg = Configuration.load();

            if (!cfg.appArea)
                cfg.appArea = {};

            if (!cfg.appArea[req.params.appArea])
                cfg.appArea[req.params.appArea] = {} as any;

            if (!cfg.appArea[req.params.appArea].settings)
                cfg.appArea[req.params.appArea].settings = {} as any;

            cfg.appArea[req.params.appArea].settings.backend = newSettings.backend;            
            Configuration.save(cfg);
            this.returnResponseSucces(res, { success: true });
        }
        catch (err) {
            this.returnResponseError(res, 400, err.message ? err.message : err);
        }
    }

    getAllConfig = (req, res): any => {
        try {
            const cfg = Configuration.load();
            delete cfg.apiKey
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
    }

}