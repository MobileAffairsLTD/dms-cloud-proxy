"use strict";
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
exports.DmsCloudClient = void 0;
var https = require("https");
var fs = require("fs");
var path = require("path");
var URL = require("url");
var basicCloudAPIUrl = 'api.portal.dynamicsmobile.com';
var DmsCloudClient = /** @class */ (function () {
    function DmsCloudClient(configuration) {
        this.configuration = configuration;
    }
    DmsCloudClient.prototype.getPendingPullPacketsList = function (appArea, type) {
        var _this = this;
        if (!this.configuration.appArea[appArea]) {
            throw new Error("AppArea " + appArea + "  is not found in config.json");
        }
        if (!this.configuration.appArea[appArea].apiKey) {
            throw new Error("AppArea ApiKey is not found  in config.json");
        }
        return new Promise(function (resolve, reject) {
            var options = {
                hostname: basicCloudAPIUrl,
                port: 443,
                path: "/mobile/erp/pull/" + appArea + "?format=json",
                method: 'GET',
                headers: {
                    "x-api-key": _this.configuration.appArea[appArea].apiKey
                }
            };
            if (type == 'image') {
                //force downloading of big files/images only
                options.path += '&packetType=file';
            }
            var responseBody = '';
            var req = https.request(options, function (res) {
                res.on('data', function (d) {
                    responseBody += d;
                });
                res.on('end', function () {
                    if (res.statusCode != 200) {
                        var errMsg = res.statusCode + "." + (res.statusMessage ? res.statusMessage : 'General Error');
                        reject(errMsg);
                    }
                    else {
                        var packets = JSON.parse(responseBody);
                        packets.forEach(function (p) {
                            p.appArea = appArea;
                        });
                        resolve(packets);
                    }
                });
            });
            req.on('error', function (error) {
                reject(error);
            });
            req.end();
        });
    };
    DmsCloudClient.prototype.downloadPacket = function (packet, localFolderPath) {
        return __awaiter(this, void 0, void 0, function () {
            var tempUrl, url, packetContent;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var options = {
                                hostname: basicCloudAPIUrl,
                                port: 443,
                                path: "/mobile/erp/pull/" + packet.appArea + "/link?path=" + packet.url.replace("/json/", "/xml/").replace('.json', '.xml'),
                                method: 'GET',
                                headers: {
                                    "x-api-key": _this.configuration.appArea[packet.appArea].apiKey
                                }
                            };
                            var responseBody = '';
                            var req = https.request(options, function (res) {
                                res.on('data', function (d) {
                                    responseBody += d;
                                });
                                res.on('end', function () {
                                    if (res.statusCode != 200) {
                                        var errMsg = res.statusCode + "." + (res.statusMessage ? res.statusMessage : 'General Error');
                                        reject(errMsg);
                                    }
                                    else {
                                        resolve(JSON.parse(responseBody));
                                    }
                                });
                            });
                            req.on('error', function (error) {
                                reject(error);
                            });
                            req.end();
                        })];
                    case 1:
                        tempUrl = _a.sent();
                        url = new URL.URL(tempUrl.url);
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                var options = {
                                    hostname: url.hostname,
                                    port: 443,
                                    path: "" + url.pathname + url.search,
                                    method: 'GET'
                                };
                                var responseBody = '';
                                var req = https.request(options, function (res) {
                                    res.on('data', function (d) {
                                        responseBody += d;
                                    });
                                    res.on('end', function () {
                                        if (res.statusCode != 200) {
                                            var errMsg = res.statusCode + "." + (res.statusMessage ? res.statusMessage : 'General Error');
                                            reject(errMsg);
                                        }
                                        else {
                                            resolve(responseBody);
                                        }
                                    });
                                });
                                req.on('error', function (error) {
                                    reject(error);
                                });
                                req.end();
                            })];
                    case 2:
                        packetContent = _a.sent();
                        if (!fs.existsSync(localFolderPath)) {
                            fs.mkdirSync(localFolderPath);
                        }
                        if (!fs.existsSync(path.join(localFolderPath, packet.appArea))) {
                            fs.mkdirSync(path.join(localFolderPath, packet.appArea));
                        }
                        fs.writeFileSync(path.join(localFolderPath, packet.appArea, packet.id + ".xml"), packetContent);
                        fs.writeFileSync(path.join(localFolderPath, packet.appArea, packet.id + ".xml.meta"), JSON.stringify(packet));
                        return [2 /*return*/];
                }
            });
        });
    };
    DmsCloudClient.prototype.downloadImage = function (packet, localFolderPath) {
        return __awaiter(this, void 0, void 0, function () {
            "";
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    return DmsCloudClient;
}());
exports.DmsCloudClient = DmsCloudClient;
//# sourceMappingURL=dms-cloud-api.js.map