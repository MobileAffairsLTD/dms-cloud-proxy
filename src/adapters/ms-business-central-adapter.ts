import * as httpntlm from '../libs/httpntlm/httpntlm';
const parser = require("fast-xml-parser").default;
import * as fs from 'fs';
import * as path from 'path';
import { BackendAdapterBase } from './BackendAdapterBase';
import { ConfigurationObject } from '../application/configuration';
import he from 'he';
import { CloudPacket } from '../workers/dms-cloud-api';

export class DynamicsBusinessCentralClient extends BackendAdapterBase {

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
        super(authType, protocol, host, port, path, username, password, domain, workstation, configuration);
    }

    public executeGet(company: string | null, entityName: string, filter: string | null, sort: string | null, max: number | null, page: number | null, apply: string): Promise<Array<any>> {
        if (!entityName)
            throw 'entityName parameter is required for BC LiveLink';

        if (!this.authType)
            throw '"authType" role setting is required for BC LiveLink';

        if (!this.host)
            throw '"host" role setting is required for BC LiveLink';

        if (!this.path)
            throw '"path" role setting is required for BC LiveLink';

        const me = this;
        return new Promise((resolve: any, reject: any): void => {
            let url;
            if (me.path.startsWith("/")) {
                me.path = me.path.substr(1);
            }

            //company as a segment  - used in some bc versions
            // if (!company)
            //     url = `${me.protocol ? me.protocol : 'http'}://${me.host}:${me.port ? me.port : '80'}/${me.path}/${entityName}?$format=json`;
            // else
            //     url = `${me.protocol ? me.protocol : 'http'}://${me.host}:${me.port ? me.port : '80'}/${me.path}/Company('${encodeURIComponent(company)}')/${entityName}?$format=json`;

            //company as url query param  - used in some bc versions
            if (!company)
                url = `${me.protocol ? me.protocol : 'http'}://${me.host}:${me.port ? me.port : '80'}/${me.path}/${encodeURIComponent(entityName)}?$format=json`;
            else
                url = `${me.protocol ? me.protocol : 'http'}://${me.host}:${me.port ? me.port : '80'}/${me.path}/${encodeURIComponent(entityName)}?company=${encodeURIComponent(company)}&$format=json`;


            if (filter)
                url += `&$filter=${encodeURIComponent(filter)}`;
            if (sort)
                url += `&$orderby=${encodeURIComponent(sort)}`;
            if (max)
                url += `&$top=${max}`;
            if (page)
                url += `&$skip=${page}`;
            if (apply)
                url += `&$apply=${encodeURIComponent(apply)}`;



            // console.log('Dynamics Business Central Client authType: ' + this.authType);
            // console.log('service url:', url);
            (httpntlm as any).get({
                url: url,
                username: me.username,
                password: me.password,
                workstation: me.workstation,
                domain: me.domain
            }, function (err: any, res: any) {
                try {
                    if (err)
                        reject(err);
                    if (!res)
                        reject('Server did not return response!')
                    else
                        if (res.statusCode != 200)
                            reject(JSON.parse(res.body));
                        else
                            resolve(JSON.parse(res.body).value);
                }
                catch (err2) {
                    //returned body was not json
                    reject(err2);
                }
            });
        });
    }

    public executeCreate(company: string | null, entityName: string, body: any): Promise<string> {
        if (!entityName)
            throw 'entityName parameter is required for BC LiveLink';

        if (!body)
            throw 'body parameter is required for BC LiveLink';

        if (!this.authType)
            throw '"authType" role setting is required for BC LiveLink';

        if (!this.host)
            throw '"host" role setting is required for BC LiveLink';

        if (!this.path)
            throw '"path" role setting is required for BC LiveLink';

        if(this.path[0]=='/')//remove leading backslash
            this.path = this.path.substring(1);

        return new Promise((resolve: any, reject: any): void => {
            let url;
            if (!company)
                url = `${this.protocol ? this.protocol : 'http'}://${this.host}:${this.port ? this.port : '80'}/${this.path}/${entityName}`;
            else
                //url = `${this.protocol ? this.protocol : 'http'}://${this.host}:${this.port ? this.port : '80'}/${this.path}/Company('${encodeURIComponent(company)}')/${entityName}`;
                url = `${this.protocol ? this.protocol : 'http'}://${this.host}:${this.port ? this.port : '80'}/${this.path}/${entityName}?company=${encodeURIComponent(company)}`;

            // console.log('Dynamics Business Central Client authType: ' + this.authType);
            // console.log('url: ', url);
            // console.log('post: ', body);
            (httpntlm as any).post({
                url: url,
                username: this.username,
                password: this.password,
                workstation: this.workstation,
                domain: this.domain,
                body: JSON.stringify(body),
                headers: { 'Content-Type': 'application/json' }
            }, function (err: any, res: any) {
                if (err)
                    reject(err);
                if (!res)
                    reject('Server did not return response!')
                else
                    if (res.statusCode != 200 && res.statusCode != 201)
                        reject(`${res.statusCode}.${res.statusText?res.statusText:res.body}`);
                    else {
                        const r = JSON.parse(res.body);
                        delete r["@odata.context"];
                        delete r["@odata.etag"];
                        resolve(r);
                    }
            });
        });
    }

    public executeUpdate(company: string | null, entityName: string, pkValues: string, body: any): Promise<string> {
        if (!entityName)
            throw 'entityName parameter is required for BC LiveLink';

        if (!body)
            throw 'body parameter is required for BC LiveLink';

        if (!pkValues)
            throw 'pkValues parameter is required for BC LiveLink';

        if (!this.authType)
            throw '"authType" role setting is required for BC LiveLink';

        if (!this.host)
            throw '"host" role setting is required for BC LiveLink';

        if (!this.path)
            throw '"path" role setting is required for BC LiveLink';


        return new Promise((resolve: any, reject: any): void => {
            let url;
            if (!company)
                url = `${this.protocol ? this.protocol : 'http'}://${this.host}:${this.port ? this.port : '80'}/${this.path}/${entityName}(${pkValues})`;
            else
                //url = `${this.protocol ? this.protocol : 'http'}://${this.host}:${this.port ? this.port : '80'}/${this.path}/Company('${encodeURIComponent(company)}')/${entityName}(${pkValues})`;
                url = `${this.protocol ? this.protocol : 'http'}://${this.host}:${this.port ? this.port : '80'}/${this.path}/${entityName}(${pkValues})?company=${encodeURIComponent(company)}`;

            //console.log('Dynamics Business Central Client authType: ' + this.authType);
            //console.log('service url:', url);
            delete body["@odata.context"];
            delete body["@odata.etag"];

            (httpntlm as any).patch({
                url: url,
                body: JSON.stringify(body),
                username: this.username,
                password: this.password,
                workstation: this.workstation,
                domain: this.domain,
                headers: { 'Content-Type': 'application/json', 'If-Match': '*' }
            }, function (err: any, res: any) {
                if (err)
                    reject(err);
                if (!res)
                    reject('Server did not return response!')
                else
                    if (res.statusCode != 200 && res.statusCode != 201)
                        reject(res.statusCode + ' ' + res.body ? res.body : '');
                    else {
                        const r = JSON.parse(res.body);
                        delete r["@odata.context"];
                        delete r["@odata.etag"];
                        resolve(r);
                    }
            });
        });
    }

    public executeDelete(company: string | null, entityName: string, pkValues: string, body: string | null): Promise<string> {
        if (!entityName)
            throw 'entityName parameter is required for BC LiveLink';

        if (!body)
            throw 'body parameter is required for BC LiveLink';

        if (!pkValues)
            throw 'pkValues parameter is required for BC LiveLink';


        if (!this.authType)
            throw '"authType" role setting is required for BC LiveLink';

        if (!this.host)
            throw '"host" role setting is required for BC LiveLink';

        if (!this.path)
            throw '"path" role setting is required for BC LiveLink';


        return new Promise((resolve: any, reject: any): void => {
            let url;
            if (!company)
                url = `${this.protocol ? this.protocol : 'http'}://${this.host}:${this.port ? this.port : '80'}/${this.path}/${entityName}(${pkValues})`;
            else
                url = `${this.protocol ? this.protocol : 'http'}://${this.host}:${this.port ? this.port : '80'}/${this.path}/Company('${encodeURIComponent(company)}')/${entityName}(${pkValues})`;

            console.log('Dynamics Business Central Client authType: ' + this.authType);
            console.log('service url:', url);
            (httpntlm as any).delete({
                url: url,
                body: JSON.stringify(body),
                username: this.username,
                password: this.password,
                workstation: this.workstation,
                domain: this.domain,
                headers: { 'Content-Type': 'application/json', "If-Match": "*" }
            }, function (err: any, res: any) {
                if (err)
                    reject(err);
                if (!res)
                    reject('Server did not return response!')
                else
                    if (res.statusCode != 200 && res.statusCode != 201 && res.statusCode != 202 && res.statusCode != 203 && res.statusCode != 204)
                        reject(res.statusCode + ' ' + res.body ? res.body : '');
                    else {
                        resolve({ success: true });
                    }
            });
        });
    }


    public executeMetadata(company: string | null, entityName: string): Promise<string> {
        if (!entityName)
            throw 'entityName parameter is required for BC LiveLink';

        if (!this.authType)
            throw '"authType" role setting is required for BC LiveLink';

        if (!this.host)
            throw '"host" role setting is required for BC LiveLink';

        if (!this.path)
            throw '"path" role setting is required for BC LiveLink';


        return new Promise((resolve: any, reject: any): void => {
            const url = `${this.protocol ? this.protocol : 'http'}://${this.host}:${this.port ? this.port : '80'}/${this.path}/$metadata`;


            console.log('Get Metadata: Dynamics Business Central Client, authType: ' + this.authType);
            console.log('service url:', url);
            (httpntlm as any).get({
                url: url,
                username: this.username,
                password: this.password,
                workstation: this.workstation,
                domain: this.domain
            }, function (err: any, res: any) {
                if (err)
                    reject(err);
                if (!res)
                    reject('Server did not return response!')
                else
                    if (res.statusCode != 200)
                        reject(res.statusCode + ' ' + res.body ? res.body : '');
                    else {
                        try {

                            const options = {
                                attributeNamePrefix: "@_",
                                attrNodeName: "attr", //default is 'false'
                                textNodeName: "#text",
                                ignoreAttributes: false,
                                ignoreNameSpace: false,
                                allowBooleanAttributes: false,
                                parseNodeValue: true,
                                parseAttributeValue: false,
                                trimValues: true,
                                cdataTagName: "__cdata", //default is 'false'
                                cdataPositionChar: "\\c",
                                parseTrueNumberOnly: false,
                                arrayMode: false, //"strict"
                                attrValueProcessor: (val, attrName) => he.decode(val, { isAttributeValue: true }),//default is a=>a
                                tagValueProcessor: (val, tagName) => he.decode(val), //default is a=>a
                                stopNodes: ["parse-me-as-string"]
                            };

                            const jsonObj = parser.parse(res.body, options);
                            const entities = jsonObj['edmx:Edmx']['edmx:DataServices']['Schema']['EntityType']
                            let theEntityArray;
                            if (entityName == '*')
                                theEntityArray = entities
                            else
                                theEntityArray = entities.filter(e => e.attr['@_Name'] == entityName);


                            if (!theEntityArray) {
                                resolve([]);
                                return;
                            }
                            const reMappedEntities: any = {};
                            theEntityArray.forEach(theEntity => {
                                console.log(theEntity)
                                const reMappedEntity = {
                                    origin: 'd365bc',
                                    name: theEntity.attr['@_Name'],
                                    label: theEntity.attr['@_Name'],
                                    pluralLabel: theEntity.attr['@_Name'],
                                    pageSize: 500,
                                    searching: true,
                                    properties: {},
                                    views: {
                                        list: {
                                            properties: [] as Array<any>
                                        },
                                        default: {
                                            properties: [] as Array<any>
                                        }
                                    }
                                };
                                theEntity["Property"].forEach(p => {
                                    const newMappedProp = {
                                        label: p.attr["@_Name"],
                                        type: p.attr["@_Type"].split('.')[1],
                                        required: p.attr["@_Nullable"] == "false",
                                        length: p.attr["@_MaxLength"] ? p.attr["@_MaxLength"] : 20,
                                        sorting: true,
                                        searching: true,
                                        uiType: 'Default',
                                        syncTag: p.attr["@_Name"]
                                    }
                                    if (theEntity.Key) {
                                        console.log('obj: ', theEntity.Key.PropertyRef);
                                        if (!Array.isArray(theEntity.Key.PropertyRef)) {
                                            newMappedProp['isPK'] = theEntity.Key.PropertyRef.attr['@_Name'] == p.attr['@_Name']
                                        }
                                        else {
                                            console.log('arr: ', theEntity.Key.PropertyRef[0]);
                                            newMappedProp['isPK'] = theEntity.Key.PropertyRef.find(k => k.attr['@_Name'] == p.attr['@_Name']) != null
                                        }

                                    }
                                    if (newMappedProp.type === 'Guid') {
                                        newMappedProp.type = "String";
                                        newMappedProp.length = 50;
                                    }
                                    reMappedEntity.properties[p.attr["@_Name"]] = newMappedProp;
                                    reMappedEntity.views.list.properties.push({ name: p.attr["@_Name"] })
                                    reMappedEntity.views.default.properties.push({ name: p.attr["@_Name"] })
                                });


                                reMappedEntities[reMappedEntity.name] = reMappedEntity;
                            })
                            resolve(reMappedEntities);
                        } catch (error) {
                            reject(error.message);
                        }
                    }

            });
        });



    }

    public async postToSyncLog(appArea: string, fullCloudFilePath: string, cloudPacketMeta: CloudPacket): Promise<void> {
        
        //prepare BC packet
        //it is expected that BC will download the packet manually
        const syncPacket = {
            //entryNo: 1
            entryTimeStamp: (new Date()).toISOString(),
            //errorDescription: ""
            path: cloudPacketMeta.url,                
            direction: "Push",
            packetType: "Data",
            priority: 0,
            status: "Pending",
            deviceSetupCode: cloudPacketMeta.userName,
            company: cloudPacketMeta.companyId
        }
        //send to erp
        await this.executeCreate(cloudPacketMeta.companyId, this.configuration.slSyncLogEntityName, syncPacket);
        
        
    }
}