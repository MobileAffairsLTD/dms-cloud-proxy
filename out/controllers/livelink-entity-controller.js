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
import { DynamicsBusinessCentralClient } from "../adapters/ms-business-central-adapter";
export class LiveLinkEntityController extends ApiControlerBase {
    constructor(configuraiton) {
        super(configuraiton);
        this.get = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
                const client = new DynamicsBusinessCentralClient(appAreaConfig.settings.backend.authType, appAreaConfig.settings.backend.protocol, appAreaConfig.settings.backend.host, appAreaConfig.settings.backend.port, appAreaConfig.settings.backend.path, appAreaConfig.settings.backend.userName, appAreaConfig.settings.backend.password, appAreaConfig.settings.backend.domain, appAreaConfig.settings.backend.workstation);
                const result = yield client.executeGet(company, entityName, filter, sort, max, page, apply);
                this.returnResponseSucces(res, result);
            }
            catch (err) {
                this.returnResponseError(res, 400, err);
            }
        });
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
        this.getMetadata = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
                const client = new DynamicsBusinessCentralClient(appAreaConfig.settings.backend.authType, appAreaConfig.settings.backend.protocol, appAreaConfig.settings.backend.host, appAreaConfig.settings.backend.port, appAreaConfig.settings.backend.path, appAreaConfig.settings.backend.userName, appAreaConfig.settings.backend.password, appAreaConfig.settings.backend.domain, appAreaConfig.settings.backend.workstation);
                const result = yield client.executeMetadata(company, entityName);
                this.returnResponseSucces(res, result);
            }
            catch (err) {
                this.returnResponseError(res, 400, err);
            }
        });
    }
}
//# sourceMappingURL=livelink-entity-controller.js.map