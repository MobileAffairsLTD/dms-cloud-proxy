import { ConfigurationObject } from "../application/configuration";
import { CloudPacket } from "../workers/dms-cloud-api";

export class BackendAdapterBase {
    
   
    constructor(
        protected authType: string,
        protected protocol: string,
        protected host: string,
        protected port: number | null,
        protected path: string,
        protected username: string,
        protected password: string,
        protected domain: string,
        protected workstation: string,
        protected configuration: ConfigurationObject) {

    }

    public  validateConfiguration(appArea: string): void {
        if (!this.configuration.appArea[appArea]) {
            throw new Error(`Apparea ${appArea} does not exists`);
        }

        if (!this.configuration.appArea[appArea].backend) {
            throw new Error(`Apparea ${appArea}.backend property is required`);
        }

        if (!this.configuration.appArea[appArea].apiKey) {
            throw new Error(`Apparea ${appArea}.apiKey property is required`);
        }
        if(!this.configuration.appArea[appArea].defaultCompany){
            throw new Error(`AppArea ${appArea}.defaultCompany property is missing!`);
        }
        
    }


    public executeGet(company: string | null, entityName: string, filter: string | null, sort: string | null, max: number | null, page: number | null, apply: string): Promise<Array<any>> {
        return null;
    }

    public executeCreate(company: string | null, entityName: string, body: any): Promise<string> {
        return null;
    }

    public executeUpdate(company: string | null, entityName: string, pkValues: string, body: any | null): Promise<string> {
        return null;
    }

    public executeDelete(company: string | null, entityName: string, pkValues: string, body: any | null): Promise<string> {
        return null;
    }

    public executeMetadata(company: string | null, entityName: string): Promise<string> {
        return null;
    }

    public async postToSyncLog(appArea: string, fullCloudFilePath: string, cloudPacketMeta: CloudPacket): Promise<void> {
        //console.log(`postToSyncLog: ${cloudFilePath}`);
        return null;
    }

    public async executeCommand(company: any, command: any, arg2: any): Promise<any> {
        throw new Error("ExecuteCommand method is not implemented.");
    }



}