import { ApiControlerBase } from "./api-controller-base";
import { check } from "express-validator";
import { Configuration, ConfigurationObject } from "../application/configuration";
import * as fs from 'fs';
import * as path from 'path';

function deleteModule(moduleName) {
    var solvedName = require.resolve(moduleName),
      nodeModule = require.cache[solvedName];
    if (nodeModule) {
      for (var i = 0; i < nodeModule.children.length; i++) {
        var child = nodeModule.children[i];
        deleteModule(child.filename);
      }
      delete require.cache[solvedName];
    }
  }

export class ApplicationCommandController extends ApiControlerBase {

    constructor(configuraiton: ConfigurationObject) {
        super(configuraiton);
    }

    execute = async (req, res): Promise<any> => {

        const appArea = req.params.appArea;
        const appCode = req.params.appCode;
        const commandName = req.params.command;

        console.log(appArea, appCode, commandName);

        
        require('browser-env')(['window'], { url: 'http://localhost', storageQuota: 1000000, });

        global.HTMLElement = window.HTMLElement;
        global.document = window.document;
        global.navigator = window.navigator;
        try {

            const modulePath = path.resolve(`./out/appArea/${appArea}/${appCode}/backendservice.js`);
            if (!fs.existsSync(modulePath)) {
                throw new Error(`BackendService module for ${appArea}.${appCode} does not exists!`);
            }
            //TODO: check of the module was changed and delete it only if a change is there
            deleteModule(modulePath);
            const BackendService = require(modulePath).default;
            const be = new BackendService();
            const serviceResponse = await be.processEvent({
                eventName: 'system:api:inbound', eventArguments: {
                    appArea: appArea,
                    appCode: appCode,
                    commandName: commandName
                }
            });
            this.returnResponseSucces(res, { message: serviceResponse })
        }
        catch (err) {
            console.log(err);
            console.log(err.stack);
            this.returnResponseError(res, 400, err.message?err.message:err)
        }

    }
}