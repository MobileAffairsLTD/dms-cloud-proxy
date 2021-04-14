"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_controller_base_1 = require("./api-controller-base");
const ms_business_central_adapter_1 = require("../adapters/ms-business-central-adapter");
class LiveLinkEntityController extends api_controller_base_1.ApiControlerBase {
    constructor(configuraiton) {
        super(configuraiton);
        this.get = async (req, res) => {
            try {
                const appArea = req.params.appArea;
                if (!appArea) {
                    throw 'appArea parameter is required!';
                }
                const appAreaConfig = this.configuraiton.appArea[appArea];
                if (!appAreaConfig) {
                    throw 'appArea parameter value is wrong!';
                }
                const entityName = req.params.entity;
                if (!entityName) {
                    throw 'entityName parameter is required!';
                }
                const filter = req.query['$filter'];
                const sort = req.query['$sort'];
                const apply = req.query['$apply'];
                const max = req.query['$limit'] ? req.query['$limit'] : 100;
                const page = req.query['$page'] ? req.query['$page'] : 0;
                const company = req.query['$company'] ? req.query['$company'] : '';
                const client = new ms_business_central_adapter_1.DynamicsBusinessCentralClient(appAreaConfig.settings.backend.authType, appAreaConfig.settings.backend.protocol, appAreaConfig.settings.backend.host, appAreaConfig.settings.backend.port, appAreaConfig.settings.backend.path, appAreaConfig.settings.backend.userName, appAreaConfig.settings.backend.password, appAreaConfig.settings.backend.domain, appAreaConfig.settings.backend.workstation);
                const result = await client.executeGet(company, entityName, filter, sort, max, page, apply);
                this.returnResponseSucces(res, result);
            }
            catch (err) {
                this.returnResponseError(res, 400, err);
            }
        };
        this.create = (req, res) => {
            this.returnResponseSucces(res, { message: 'create entity' });
        };
        this.update = (req, res) => {
            this.returnResponseSucces(res, { message: 'update entity' });
        };
        this.delete = (req, res) => {
            this.returnResponseSucces(res, { message: 'delete entity' });
        };
        this.execCommand = (req, res) => {
            this.returnResponseSucces(res, { message: 'exec cmd' });
        };
        this.getMetadata = async (req, res) => {
            try {
                const appArea = req.params.appArea;
                if (!appArea) {
                    throw 'appArea parameter is required!';
                }
                const appAreaConfig = this.configuraiton.appArea[appArea];
                if (!appAreaConfig) {
                    throw 'appArea parameter value is wrong!';
                }
                const entityName = req.params.entity;
                if (!entityName) {
                    throw 'entityName parameter is required!';
                }
                const company = req.query['$company'] ? req.query['$company'] : '';
                const client = new ms_business_central_adapter_1.DynamicsBusinessCentralClient(appAreaConfig.settings.backend.authType, appAreaConfig.settings.backend.protocol, appAreaConfig.settings.backend.host, appAreaConfig.settings.backend.port, appAreaConfig.settings.backend.path, appAreaConfig.settings.backend.userName, appAreaConfig.settings.backend.password, appAreaConfig.settings.backend.domain, appAreaConfig.settings.backend.workstation);
                const result = await client.executeMetadata(company, entityName);
                this.returnResponseSucces(res, result);
            }
            catch (err) {
                this.returnResponseError(res, 400, err);
            }
        };
    }
}
exports.LiveLinkEntityController = LiveLinkEntityController;
//# sourceMappingURL=livelink-entity-controller.js.map