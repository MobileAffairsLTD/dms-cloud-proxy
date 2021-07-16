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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicsBusinessCentralClient = void 0;
var httpntlm = require("../libs/httpntlm/httpntlm");
var parser = require("fast-xml-parser").default;
var fs = require("fs");
var path = require("path");
var BackendAdapterBase_1 = require("./BackendAdapterBase");
var he_1 = require("he");
var DynamicsBusinessCentralClient = /** @class */ (function (_super) {
    __extends(DynamicsBusinessCentralClient, _super);
    function DynamicsBusinessCentralClient(authType, protocol, host, port, path, username, password, domain, workstation, configuration) {
        return _super.call(this, authType, protocol, host, port, path, username, password, domain, workstation, configuration) || this;
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
                    reject(err2);
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
        if (this.path[0] == '/') //remove leading backslash
            this.path = this.path.substring(1);
        return new Promise(function (resolve, reject) {
            var url;
            if (!company)
                url = (_this.protocol ? _this.protocol : 'http') + "://" + _this.host + ":" + (_this.port ? _this.port : '80') + "/" + _this.path + "/" + entityName;
            else
                //url = `${this.protocol ? this.protocol : 'http'}://${this.host}:${this.port ? this.port : '80'}/${this.path}/Company('${encodeURIComponent(company)}')/${entityName}`;
                url = (_this.protocol ? _this.protocol : 'http') + "://" + _this.host + ":" + (_this.port ? _this.port : '80') + "/" + _this.path + "/" + entityName + "?company=" + encodeURIComponent(company);
            // console.log('Dynamics Business Central Client authType: ' + this.authType);
            // console.log('url: ', url);
            // console.log('post: ', body);
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
                    reject(res.statusCode + "." + (res.statusText ? res.statusText : res.body));
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
                //url = `${this.protocol ? this.protocol : 'http'}://${this.host}:${this.port ? this.port : '80'}/${this.path}/Company('${encodeURIComponent(company)}')/${entityName}(${pkValues})`;
                url = (_this.protocol ? _this.protocol : 'http') + "://" + _this.host + ":" + (_this.port ? _this.port : '80') + "/" + _this.path + "/" + entityName + "(" + pkValues + ")?company=" + encodeURIComponent(company);
            //console.log('Dynamics Business Central Client authType: ' + this.authType);
            //console.log('service url:', url);
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
                    reject(res.statusCode + ' ' + res.body ? res.body : '');
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
                    reject(res.statusCode + ' ' + res.body ? res.body : '');
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
                    reject(res.statusCode + ' ' + res.body ? res.body : '');
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
    DynamicsBusinessCentralClient.prototype.postToSyncLog = function (appArea, cloudFilePath) {
        return __awaiter(this, void 0, void 0, function () {
            var fullFilePath, cloudPacketMeta, fullMetaFilePath, syncPacket;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("postToSyncLog: " + cloudFilePath);
                        fullFilePath = path.join(this.configuration.localCloudPackets, appArea, cloudFilePath);
                        if (!fs.existsSync(fullFilePath)) {
                            throw new Error("Local cloud file " + fullFilePath + " does not exists!");
                        }
                        fullMetaFilePath = path.join(this.configuration.localCloudPackets, appArea, cloudFilePath + 'meta');
                        if (!fs.existsSync(fullMetaFilePath)) {
                            cloudPacketMeta = {
                                appArea: appArea,
                                appCode: '',
                                companyId: this.configuration.appArea[appArea].defaultCompany,
                                id: fullFilePath,
                                onDate: (new Date()).toISOString(),
                                packetType: 'data',
                                receiptHandle: '',
                                size: 0,
                                url: '',
                                userName: ''
                            };
                        }
                        else {
                            cloudPacketMeta = JSON.parse(fs.readFileSync(fullMetaFilePath, 'utf8'));
                        }
                        syncPacket = {
                            //entryNo: 1
                            entryTimeStamp: (new Date()).toISOString(),
                            //errorDescription: ""
                            path: '',
                            direction: "Push",
                            packetType: "Data",
                            priority: 0,
                            status: "Pending",
                            deviceSetupCode: cloudPacketMeta.userName,
                            company: cloudPacketMeta.companyId
                        };
                        return [4 /*yield*/, this.executeCreate(cloudPacketMeta.companyId, this.configuration.slSyncLogEntityName, syncPacket)];
                    case 1:
                        _a.sent();
                        fs.unlinkSync(fullFilePath);
                        if (fs.existsSync(fullMetaFilePath)) {
                            fs.unlinkSync(fullMetaFilePath);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return DynamicsBusinessCentralClient;
}(BackendAdapterBase_1.BackendAdapterBase));
exports.DynamicsBusinessCentralClient = DynamicsBusinessCentralClient;
//# sourceMappingURL=ms-business-central-adapter.js.map