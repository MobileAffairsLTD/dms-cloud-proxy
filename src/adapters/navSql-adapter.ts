import * as httpntlm from '../libs/httpntlm/httpntlm';
const parser = require("fast-xml-parser").default;
import he from 'he';
import { BackendAdapterBase } from './BackendAdapterBase';
import { ConfigurationObject } from '../application/configuration';
const sql = require('mssql')

export class DynamicsNAVSQLBackendAdapter extends BackendAdapterBase {

    constructor(
        authType: string,
        protocol: string,
        host: string,
        port: number | null,
        path: string,
        username: string,
        password: string,
        domain: string,
        workstation: string,
        configuration: ConfigurationObject) {
        super(authType, protocol, host, port, path, username, password, domain, workstation,configuration);
    }

    public async executeGet(company: string | null, entityName: string, filter: string | null, sort: string | null, max: number | null, page: number | null, apply: string): Promise<Array<any>> {
        if (!entityName)
            throw 'entityName parameter is required for NAV-SQL LiveLink';

        if (!this.authType)
            throw '"authType" role setting is required for NAV-SQL LiveLink';

        if (!this.host)
            throw '"host" role setting is required for NAV-SQL LiveLink';

        if (!this.path)
            throw '"path" role setting is required for NAV-SQL LiveLink';

        try {
            let maxRecs = '';
            if(max) {
             maxRecs = ` top ${maxRecs} `;
            }
            let where = '';
            if(filter) {
                where = ` WHERE ${filter} `;
            }                

            let orderby = '';
            if(sort) {
                orderby = ` ORDER BY ${sort} `;
            }

            // make sure that any items are correctly URL encoded in the connection string
            await sql.connect(`Server=${this.host},${this.port}?${this.port}:'1433';Database=${this.path};User Id=${this.username};Password=${this.password};Encrypt=false`)
            const result = await sql.query (`SELECT ${maxRecs} * FROM [${company?company+'$':''}${entityName}] ${where} ${orderby}`);
            if(result && result.recordsets && result.recordsets.length>0){
                if(result.recordsets.length==1)
                    return result.recordsets[0];
                else 
                    return result.recordsets;        
            }
            else {
                return [];
            }
                            
        } catch (err) {
            throw err;
        }


     
    }

    public executeCreate(company: string | null, entityName: string, body: string): Promise<string> {
        throw `create method is not supported for this adapter type`
    }

    public executeUpdate(company: string | null, entityName: string, pkValues: string, body: string | null): Promise<string> {
        throw `update method is not supported for this adapter type`
    }

    public executeDelete(company: string | null, entityName: string, pkValues: string, body: string | null): Promise<string> {
        throw `delete method is not supported for this adapter type`
    }


    public executeMetadata(company: string | null, entityName: string): Promise<string> {
        throw `metadata method is not supported for this adapter type`
    }
}