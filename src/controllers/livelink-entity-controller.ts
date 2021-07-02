import { ApiControlerBase } from "./api-controller-base";
import { betBC, betD365FO, betNavSql, ConfigurationObject } from "../application/configuration";
import { DynamicsBusinessCentralClient } from "../adapters/ms-business-central-adapter";
import { BackendAdapterBase } from "../adapters/BackendAdapterBase";
import { backendAdapterFactory } from "../adapters/BackendAdapterFactory";

export class LiveLinkEntityController extends ApiControlerBase {

    constructor(configuraiton: ConfigurationObject) {
        super(configuraiton);
    }

    get = async (req, res): Promise<void> => {
        try {
            const appArea = req.params.appArea;
            if (!appArea) {
                throw 'appArea parameter is required!'
            }
        
            const entityName = req.params.entity;
            if (!entityName) {
                throw 'entityName parameter is required!'
            }

            const filter = req.query['$filter'];
            const sort = req.query['$sort'];
            const apply = req.query['$apply'];
            const max = req.query['$limit'] ? req.query['$limit'] : 100;
            const page = req.query['$page'] ? req.query['$page'] : 0;
            const company = req.query['$company'] ? req.query['$company'] : '';

            const client = backendAdapterFactory(appArea, this.configuraiton);
            const result = await client.executeGet(company, entityName, filter, sort, max, page, apply);

            this.returnResponseSucces(res, result)
        }
        catch (err) {
            this.returnResponseError(res, 400, err)
        }
    }

    create = (req, res) => {
        this.returnResponseSucces(res, { message: 'create entity' })
    }

    update = (req, res) => {
        this.returnResponseSucces(res, { message: 'update entity' })
    }

    delete = (req, res) => {
        this.returnResponseSucces(res, { message: 'delete entity' })
    }

    execCommand = (req, res) => {
        this.returnResponseSucces(res, { message: 'exec cmd' })
    }

    getMetadata = async (req, res)=> {
        try {
            const appArea = req.params.appArea;
            if (!appArea) {
                throw 'appArea parameter is required!'
            }
            const appAreaConfig = this.configuraiton.appArea[appArea];
            if (!appAreaConfig) {
                throw 'appArea parameter value is wrong!'
            }

            const entityName = req.params.entity;
            if (!entityName) {
                throw 'entityName parameter is required!'
            }

            const company = req.query['$company'] ? req.query['$company'] : '';



            const client = new DynamicsBusinessCentralClient(
                appAreaConfig.settings.backend.authType,
                appAreaConfig.settings.backend.protocol,
                appAreaConfig.settings.backend.host,
                appAreaConfig.settings.backend.port,
                appAreaConfig.settings.backend.path,
                appAreaConfig.settings.backend.userName,
                appAreaConfig.settings.backend.password,
                appAreaConfig.settings.backend.domain,
                appAreaConfig.settings.backend.workstation
            );


            const result = await client.executeMetadata(company, entityName);

            this.returnResponseSucces(res, result)
        }
        catch (err) {
            this.returnResponseError(res, 400, err)
        }
    }
}