import * as httpntlm from '../libs/httpntlm/httpntlm';
const parser = require("fast-xml-parser").default;
import he from 'he';
export class DynamicsBusinessCentralClient {
    constructor(authType, protocol, host, port, path, username, password, domain, workstation) {
        this.authType = authType;
        this.protocol = protocol;
        this.host = host;
        this.port = port;
        this.path = path;
        this.username = username;
        this.password = password;
        this.domain = domain;
        this.workstation = workstation;
    }
    executeGet(company, entityName, filter, sort, max, page, apply) {
        if (!entityName)
            throw 'entityName parameter is required for BC LiveLink';
        if (!this.authType)
            throw '"authType" role setting is required for BC LiveLink';
        if (!this.host)
            throw '"host" role setting is required for BC LiveLink';
        if (!this.path)
            throw '"path" role setting is required for BC LiveLink';
        const me = this;
        return new Promise((resolve, reject) => {
            let url;
            if (!company)
                url = `${me.protocol ? me.protocol : 'http'}://${me.host}:${me.port ? me.port : '80'}/${me.path}/${entityName}?$format=json`;
            else
                url = `${me.protocol ? me.protocol : 'http'}://${me.host}:${me.port ? me.port : '80'}/${me.path}/Company('${encodeURIComponent(company)}')/${entityName}?$format=json`;
            if (filter)
                url += `&$filter=${filter}`;
            if (sort)
                url += `&$orderby=${sort}`;
            if (max)
                url += `&$top=${max}`;
            if (page)
                url += `&$skip=${page}`;
            if (apply)
                url += `&$apply=${apply}`;
            // console.log('Dynamics Business Central Client authType: ' + this.authType);
            // console.log('service url:', url);
            httpntlm.get({
                url: url,
                username: me.username,
                password: me.password,
                workstation: me.workstation,
                domain: me.domain
            }, function (err, res) {
                if (err)
                    reject(err);
                if (!res)
                    reject('Server did not return response!');
                else if (res.statusCode != 200)
                    reject(JSON.parse(res.body));
                else
                    resolve(JSON.parse(res.body).value);
            });
        });
    }
    executeCreate(company, entityName, body) {
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
        return new Promise((resolve, reject) => {
            let url;
            if (!company)
                url = `${this.protocol ? this.protocol : 'http'}://${this.host}:${this.port ? this.port : '80'}/${this.path}/${entityName}`;
            else
                url = `${this.protocol ? this.protocol : 'http'}://${this.host}:${this.port ? this.port : '80'}/${this.path}/Company('${encodeURIComponent(company)}')/${entityName}`;
            console.log('Dynamics Business Central Client authType: ' + this.authType);
            console.log('url: ', url);
            console.log('post: ', body);
            httpntlm.post({
                url: url,
                username: this.username,
                password: this.password,
                workstation: this.workstation,
                domain: this.domain,
                body: JSON.stringify(body),
                headers: { 'Content-Type': 'application/json' }
            }, function (err, res) {
                if (err)
                    reject(err);
                if (!res)
                    reject('Server did not return response!');
                else if (res.statusCode != 200 && res.statusCode != 201)
                    reject(res.statusCode);
                else {
                    const r = JSON.parse(res.body);
                    delete r["@odata.context"];
                    delete r["@odata.etag"];
                    resolve(r);
                }
            });
        });
    }
    executeUpdate(company, entityName, pkValues, body) {
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
        return new Promise((resolve, reject) => {
            let url;
            if (!company)
                url = `${this.protocol ? this.protocol : 'http'}://${this.host}:${this.port ? this.port : '80'}/${this.path}/${entityName}(${pkValues})`;
            else
                url = `${this.protocol ? this.protocol : 'http'}://${this.host}:${this.port ? this.port : '80'}/${this.path}/Company('${encodeURIComponent(company)}')/${entityName}(${pkValues})`;
            console.log('Dynamics Business Central Client authType: ' + this.authType);
            console.log('service url:', url);
            delete body["@odata.context"];
            delete body["@odata.etag"];
            httpntlm.patch({
                url: url,
                body: JSON.stringify(body),
                username: this.username,
                password: this.password,
                workstation: this.workstation,
                domain: this.domain,
                headers: { 'Content-Type': 'application/json', 'If-Match': '*' }
            }, function (err, res) {
                if (err)
                    reject(err);
                if (!res)
                    reject('Server did not return response!');
                else if (res.statusCode != 200 && res.statusCode != 201)
                    reject(res.statusCode);
                else {
                    const r = JSON.parse(res.body);
                    delete r["@odata.context"];
                    delete r["@odata.etag"];
                    resolve(r);
                }
            });
        });
    }
    executeDelete(company, entityName, pkValues, body) {
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
        return new Promise((resolve, reject) => {
            let url;
            if (!company)
                url = `${this.protocol ? this.protocol : 'http'}://${this.host}:${this.port ? this.port : '80'}/${this.path}/${entityName}(${pkValues})`;
            else
                url = `${this.protocol ? this.protocol : 'http'}://${this.host}:${this.port ? this.port : '80'}/${this.path}/Company('${encodeURIComponent(company)}')/${entityName}(${pkValues})`;
            console.log('Dynamics Business Central Client authType: ' + this.authType);
            console.log('service url:', url);
            httpntlm.delete({
                url: url,
                body: JSON.stringify(body),
                username: this.username,
                password: this.password,
                workstation: this.workstation,
                domain: this.domain,
                headers: { 'Content-Type': 'application/json', "If-Match": "*" }
            }, function (err, res) {
                if (err)
                    reject(err);
                if (!res)
                    reject('Server did not return response!');
                else if (res.statusCode != 200 && res.statusCode != 201 && res.statusCode != 202 && res.statusCode != 203 && res.statusCode != 204)
                    reject(res.statusCode);
                else {
                    resolve({ success: true });
                }
            });
        });
    }
    executeMetadata(company, entityName) {
        if (!entityName)
            throw 'entityName parameter is required for BC LiveLink';
        if (!this.authType)
            throw '"authType" role setting is required for BC LiveLink';
        if (!this.host)
            throw '"host" role setting is required for BC LiveLink';
        if (!this.path)
            throw '"path" role setting is required for BC LiveLink';
        return new Promise((resolve, reject) => {
            const url = `${this.protocol ? this.protocol : 'http'}://${this.host}:${this.port ? this.port : '80'}/${this.path}/$metadata`;
            console.log('Get Metadata: Dynamics Business Central Client, authType: ' + this.authType);
            console.log('service url:', url);
            httpntlm.get({
                url: url,
                username: this.username,
                password: this.password,
                workstation: this.workstation,
                domain: this.domain
            }, function (err, res) {
                if (err)
                    reject(err);
                if (!res)
                    reject('Server did not return response!');
                else if (res.statusCode != 200)
                    reject(res.statusCode);
                else {
                    try {
                        const options = {
                            attributeNamePrefix: "@_",
                            attrNodeName: "attr",
                            textNodeName: "#text",
                            ignoreAttributes: false,
                            ignoreNameSpace: false,
                            allowBooleanAttributes: false,
                            parseNodeValue: true,
                            parseAttributeValue: false,
                            trimValues: true,
                            cdataTagName: "__cdata",
                            cdataPositionChar: "\\c",
                            parseTrueNumberOnly: false,
                            arrayMode: false,
                            attrValueProcessor: (val, attrName) => he.decode(val, { isAttributeValue: true }),
                            tagValueProcessor: (val, tagName) => he.decode(val),
                            stopNodes: ["parse-me-as-string"]
                        };
                        const jsonObj = parser.parse(res.body, options);
                        const entities = jsonObj['edmx:Edmx']['edmx:DataServices']['Schema']['EntityType'];
                        let theEntityArray;
                        if (entityName == '*')
                            theEntityArray = entities;
                        else
                            theEntityArray = entities.filter(e => e.attr['@_Name'] == entityName);
                        if (!theEntityArray) {
                            resolve([]);
                            return;
                        }
                        const reMappedEntities = {};
                        theEntityArray.forEach(theEntity => {
                            console.log(theEntity);
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
                                        properties: []
                                    },
                                    default: {
                                        properties: []
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
                                };
                                if (theEntity.Key) {
                                    console.log('obj: ', theEntity.Key.PropertyRef);
                                    if (!Array.isArray(theEntity.Key.PropertyRef)) {
                                        newMappedProp['isPK'] = theEntity.Key.PropertyRef.attr['@_Name'] == p.attr['@_Name'];
                                    }
                                    else {
                                        console.log('arr: ', theEntity.Key.PropertyRef[0]);
                                        newMappedProp['isPK'] = theEntity.Key.PropertyRef.find(k => k.attr['@_Name'] == p.attr['@_Name']) != null;
                                    }
                                }
                                if (newMappedProp.type === 'Guid') {
                                    newMappedProp.type = "String";
                                    newMappedProp.length = 50;
                                }
                                reMappedEntity.properties[p.attr["@_Name"]] = newMappedProp;
                                reMappedEntity.views.list.properties.push({ name: p.attr["@_Name"] });
                                reMappedEntity.views.default.properties.push({ name: p.attr["@_Name"] });
                            });
                            reMappedEntities[reMappedEntity.name] = reMappedEntity;
                        });
                        resolve(reMappedEntities);
                    }
                    catch (error) {
                        reject(error.message);
                    }
                }
            });
        });
    }
}
//# sourceMappingURL=ms-business-central-adapter.js.map