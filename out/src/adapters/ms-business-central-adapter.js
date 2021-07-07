"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicsBusinessCentralClient = void 0;
var httpntlm = require("../libs/httpntlm/httpntlm");
var parser = require("fast-xml-parser").default;
var he_1 = require("he");
var BackendAdapterBase_1 = require("./BackendAdapterBase");
var DynamicsBusinessCentralClient = /** @class */ (function (_super) {
    __extends(DynamicsBusinessCentralClient, _super);
    function DynamicsBusinessCentralClient(authType, protocol, host, port, path, username, password, domain, workstation) {
        return _super.call(this, authType, protocol, host, port, path, username, password, domain, workstation) || this;
    }
    DynamicsBusinessCentralClient.prototype.executeGet = function (company, entityName, filter, sort, max, page, apply) {
        if (!entityName)
            throw 'entityName parameter is required for BC LiveLink';
        if (!this.authType)
            throw '"authType" role setting is required for BC LiveLink';
        if (!this.host)
            throw '"host" role setting is required for BC LiveLink';
        if (!this.path)
            throw '"path" role setting is required for BC LiveLink';
        var me = this;
        return new Promise(function (resolve, reject) {
            var url;
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
                url = (me.protocol ? me.protocol : 'http') + "://" + me.host + ":" + (me.port ? me.port : '80') + "/" + me.path + "/" + encodeURIComponent(entityName) + "?$format=json";
            else
                url = (me.protocol ? me.protocol : 'http') + "://" + me.host + ":" + (me.port ? me.port : '80') + "/" + me.path + "/" + encodeURIComponent(entityName) + "?company=" + encodeURIComponent(company) + "&$format=json";
            if (filter)
                url += "&$filter=" + encodeURIComponent(filter);
            if (sort)
                url += "&$orderby=" + encodeURIComponent(sort);
            if (max)
                url += "&$top=" + max;
            if (page)
                url += "&$skip=" + page;
            if (apply)
                url += "&$apply=" + encodeURIComponent(apply);
            // console.log('Dynamics Business Central Client authType: ' + this.authType);
            // console.log('service url:', url);
            httpntlm.get({
                url: url,
                username: me.username,
                password: me.password,
                workstation: me.workstation,
                domain: me.domain
            }, function (err, res) {
                try {
                    if (err)
                        reject(err);
                    if (!res)
                        reject('Server did not return response!');
                    else if (res.statusCode != 200)
                        reject(JSON.parse(res.body));
                    else
                        resolve(JSON.parse(res.body).value);
                }
                catch (err2) {
                    //returned body was not json
                    reject();
                }
            });
        });
    };
    DynamicsBusinessCentralClient.prototype.executeCreate = function (company, entityName, body) {
        var _this = this;
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
        return new Promise(function (resolve, reject) {
            var url;
            if (!company)
                url = (_this.protocol ? _this.protocol : 'http') + "://" + _this.host + ":" + (_this.port ? _this.port : '80') + "/" + _this.path + "/" + entityName;
            else
                url = (_this.protocol ? _this.protocol : 'http') + "://" + _this.host + ":" + (_this.port ? _this.port : '80') + "/" + _this.path + "/Company('" + encodeURIComponent(company) + "')/" + entityName;
            console.log('Dynamics Business Central Client authType: ' + _this.authType);
            console.log('url: ', url);
            console.log('post: ', body);
            httpntlm.post({
                url: url,
                username: _this.username,
                password: _this.password,
                workstation: _this.workstation,
                domain: _this.domain,
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
                    var r = JSON.parse(res.body);
                    delete r["@odata.context"];
                    delete r["@odata.etag"];
                    resolve(r);
                }
            });
        });
    };
    DynamicsBusinessCentralClient.prototype.executeUpdate = function (company, entityName, pkValues, body) {
        var _this = this;
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
        return new Promise(function (resolve, reject) {
            var url;
            if (!company)
                url = (_this.protocol ? _this.protocol : 'http') + "://" + _this.host + ":" + (_this.port ? _this.port : '80') + "/" + _this.path + "/" + entityName + "(" + pkValues + ")";
            else
                url = (_this.protocol ? _this.protocol : 'http') + "://" + _this.host + ":" + (_this.port ? _this.port : '80') + "/" + _this.path + "/Company('" + encodeURIComponent(company) + "')/" + entityName + "(" + pkValues + ")";
            console.log('Dynamics Business Central Client authType: ' + _this.authType);
            console.log('service url:', url);
            delete body["@odata.context"];
            delete body["@odata.etag"];
            httpntlm.patch({
                url: url,
                body: JSON.stringify(body),
                username: _this.username,
                password: _this.password,
                workstation: _this.workstation,
                domain: _this.domain,
                headers: { 'Content-Type': 'application/json', 'If-Match': '*' }
            }, function (err, res) {
                if (err)
                    reject(err);
                if (!res)
                    reject('Server did not return response!');
                else if (res.statusCode != 200 && res.statusCode != 201)
                    reject(res.statusCode);
                else {
                    var r = JSON.parse(res.body);
                    delete r["@odata.context"];
                    delete r["@odata.etag"];
                    resolve(r);
                }
            });
        });
    };
    DynamicsBusinessCentralClient.prototype.executeDelete = function (company, entityName, pkValues, body) {
        var _this = this;
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
        return new Promise(function (resolve, reject) {
            var url;
            if (!company)
                url = (_this.protocol ? _this.protocol : 'http') + "://" + _this.host + ":" + (_this.port ? _this.port : '80') + "/" + _this.path + "/" + entityName + "(" + pkValues + ")";
            else
                url = (_this.protocol ? _this.protocol : 'http') + "://" + _this.host + ":" + (_this.port ? _this.port : '80') + "/" + _this.path + "/Company('" + encodeURIComponent(company) + "')/" + entityName + "(" + pkValues + ")";
            console.log('Dynamics Business Central Client authType: ' + _this.authType);
            console.log('service url:', url);
            httpntlm.delete({
                url: url,
                body: JSON.stringify(body),
                username: _this.username,
                password: _this.password,
                workstation: _this.workstation,
                domain: _this.domain,
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
    };
    DynamicsBusinessCentralClient.prototype.executeMetadata = function (company, entityName) {
        var _this = this;
        if (!entityName)
            throw 'entityName parameter is required for BC LiveLink';
        if (!this.authType)
            throw '"authType" role setting is required for BC LiveLink';
        if (!this.host)
            throw '"host" role setting is required for BC LiveLink';
        if (!this.path)
            throw '"path" role setting is required for BC LiveLink';
        return new Promise(function (resolve, reject) {
            var url = (_this.protocol ? _this.protocol : 'http') + "://" + _this.host + ":" + (_this.port ? _this.port : '80') + "/" + _this.path + "/$metadata";
            console.log('Get Metadata: Dynamics Business Central Client, authType: ' + _this.authType);
            console.log('service url:', url);
            httpntlm.get({
                url: url,
                username: _this.username,
                password: _this.password,
                workstation: _this.workstation,
                domain: _this.domain
            }, function (err, res) {
                if (err)
                    reject(err);
                if (!res)
                    reject('Server did not return response!');
                else if (res.statusCode != 200)
                    reject(res.statusCode);
                else {
                    try {
                        var options = {
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
                            attrValueProcessor: function (val, attrName) { return he_1.default.decode(val, { isAttributeValue: true }); },
                            tagValueProcessor: function (val, tagName) { return he_1.default.decode(val); },
                            stopNodes: ["parse-me-as-string"]
                        };
                        var jsonObj = parser.parse(res.body, options);
                        var entities = jsonObj['edmx:Edmx']['edmx:DataServices']['Schema']['EntityType'];
                        var theEntityArray = void 0;
                        if (entityName == '*')
                            theEntityArray = entities;
                        else
                            theEntityArray = entities.filter(function (e) { return e.attr['@_Name'] == entityName; });
                        if (!theEntityArray) {
                            resolve([]);
                            return;
                        }
                        var reMappedEntities_1 = {};
                        theEntityArray.forEach(function (theEntity) {
                            console.log(theEntity);
                            var reMappedEntity = {
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
                            theEntity["Property"].forEach(function (p) {
                                var newMappedProp = {
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
                                        newMappedProp['isPK'] = theEntity.Key.PropertyRef.find(function (k) { return k.attr['@_Name'] == p.attr['@_Name']; }) != null;
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
                            reMappedEntities_1[reMappedEntity.name] = reMappedEntity;
                        });
                        resolve(reMappedEntities_1);
                    }
                    catch (error) {
                        reject(error.message);
                    }
                }
            });
        });
    };
    return DynamicsBusinessCentralClient;
}(BackendAdapterBase_1.BackendAdapterBase));
exports.DynamicsBusinessCentralClient = DynamicsBusinessCentralClient;
//# sourceMappingURL=ms-business-central-adapter.js.map