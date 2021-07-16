import { ConfigurationObject } from "../application/configuration";

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


    public  executeGet(company: string | null, entityName: string, filter: string | null, sort: string | null, max: number | null, page: number | null, apply: string): Promise<Array<any>> {
        return null;
    }
    
    public  executeCreate(company: string | null, entityName: string, body: any): Promise<string> {
        return null;
    }

    public  executeUpdate(company: string | null, entityName: string, pkValues: string, body: any | null): Promise<string> {
        return null;
    }

    public  executeDelete(company: string | null, entityName: string, pkValues: string, body: any | null): Promise<string> {
        return null;
    }

    public  executeMetadata(company: string | null, entityName: string): Promise<string> {
        return null;
    }

    public postToSyncLog(appArea: string, fullCloudFilePath: string, fullMetaFilePath: string): Promise<void> {
        //console.log(`postToSyncLog: ${cloudFilePath}`);
        return null;
     }
 
   
}