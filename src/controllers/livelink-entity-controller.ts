import { ApiControlerBase } from "./api-controller-base";
import { betBC, betD365FO, betNavSql, ConfigurationObject } from "../application/configuration";
import { DynamicsBusinessCentralClient } from "../adapters/ms-business-central-adapter";
import { BackendAdapterBase } from "../adapters/BackendAdapterBase";
import { backendAdapterFactory } from "../adapters/BackendAdapterFactory";
import { error } from "node:console";
import { config } from "node:process";

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
            if (this.configuraiton.appArea[appArea].disabled != true) {
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
            else {
                throw new Error(`Application area '${appArea}' is disabled`)
            }
        }
        catch (err) {
            this.returnResponseError(res, 400, err)
        }
    }

    create = async (req, res) => {
        try {
            const appArea = req.params.appArea;
            if (!appArea) {
                throw 'appArea parameter is required!'
            }
            if (this.configuraiton.appArea[appArea].disabled != true) {
                const entityName = req.params.entity;
                if (!entityName) {
                    throw 'entityName parameter is required!'
                }

                const company = req.query['$company'] ? req.query['$company'] : '';

                const client = backendAdapterFactory(appArea, this.configuraiton);
                const result = await client.executeCreate(company, entityName,JSON.parse(req.body));

                this.returnResponseSucces(res, result)
            }
            else {
                throw new Error(`Application area '${appArea}' is disabled`)
            }
        }
        catch (err) {
            this.returnResponseError(res, 400, err)
        }
    }

    update = async (req, res) => {
        try {
            const appArea = req.params.appArea;
            if (!appArea) {
                throw 'appArea parameter is required!'
            }
            if (this.configuraiton.appArea[appArea].disabled != true) {
                const entityName = req.params.entity;
                if (!entityName) {
                    throw 'entityName parameter is required!'
                }

                const company = req.query['$company'] ? req.query['$company'] : '';
                const pk = req.query["$pk"];
                if(!pk) {
                    throw new Error ('$pk parameter is required')
                }                                    
                const client = backendAdapterFactory(appArea, this.configuraiton);
                const result = await client.executeUpdate(company, entityName, pk, JSON.parse(req.body));

                this.returnResponseSucces(res, result)
            }
            else {
                throw new Error(`Application area '${appArea}' is disabled`)
            }
        }
        catch (err) {
            this.returnResponseError(res, 400, err)
        }
    }

    delete = async (req, res) => {
        try {
            const appArea = req.params.appArea;
            if (!appArea) {
                throw 'appArea parameter is required!'
            }
            if (this.configuraiton.appArea[appArea].disabled != true) {
                const entityName = req.params.entity;
                if (!entityName) {
                    throw 'entityName parameter is required!'
                }

                const company = req.query['$company'] ? req.query['$company'] : '';
                const pk = req.query["$pk"];
                if(!pk) {
                    throw new Error ('$pk parameter is required')
                }                                    
                const client = backendAdapterFactory(appArea, this.configuraiton);
                const result = await client.executeDelete(company, entityName, pk, JSON.parse(req.body));

                this.returnResponseSucces(res, result)
            }
            else {
                throw new Error(`Application area '${appArea}' is disabled`)
            }
        }
        catch (err) {
            this.returnResponseError(res, 400, err)
        }
    }

    execCommand = async (req, res) => {
        try {
            const appArea = req.params.appArea;
            if (!appArea) {
                throw 'appArea parameter is required!'
            }
            if (this.configuraiton.appArea[appArea].disabled != true) {
                const command = req.params.command;
                if (!command) {
                    throw 'command parameter is required!'
                }

                const company = req.query['$company'] ? req.query['$company'] : '';
                const client = backendAdapterFactory(appArea, this.configuraiton);
                const result = await client.executeCommand(company, command,JSON.parse(req.body));

                this.returnResponseSucces(res, result)
            }
            else {
                throw new Error(`Application area '${appArea}' is disabled`)
            }
        }
        catch (err) {
            this.returnResponseError(res, 400, err)
        }
    }

    getMetadata = async (req, res) => {
        try {
            const appArea = req.params.appArea;
            if (!appArea) {
                throw 'appArea parameter is required!'
            }
            const appAreaConfig = this.configuraiton.appArea[appArea];

            if (!appAreaConfig) {
                throw 'appArea parameter value is wrong!'
            }

            if (appAreaConfig.disabled != true) {
                const entityName = req.params.entity;
                if (!entityName) {
                    throw 'entityName parameter is required!'
                }

                const company = req.query['$company'] ? req.query['$company'] : '';



                const client = backendAdapterFactory(appArea, this.configuraiton)


                const result = await client.executeMetadata(company, entityName);

                this.returnResponseSucces(res, result)
            }
            else {
                throw new Error(`Application area '${appArea}' is disabled`)
            }
        }
        catch (err) {
            this.returnResponseError(res, 400, err)
        }
    }
}