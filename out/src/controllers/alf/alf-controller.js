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
exports.__esModule = true;
exports.ALFController = void 0;
var api_controller_base_1 = require("../api-controller-base");
var alf_requestSignature_1 = require("./alf-requestSignature");
var alf_request_1 = require("./alf-request");
var alf_requestType_response_1 = require("./alf-requestType-response");
var alf_requestType_request_1 = require("./alf-requestType-request");
var DOMParser = require('xmldom').DOMParser;
var ALFController = /** @class */ (function (_super) {
    __extends(ALFController, _super);
    function ALFController(configuraiton) {
        var _this = _super.call(this, configuraiton) || this;
        _this.fiscalizationServiceSubmit = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var appArea, requestType, xml, contentType, _a, transformedRequest, skipUplinkRequest, successResponse, response, signedRequest, requestError_1, parsedError, parsedRequest, requestId, transformedResponse, err_1, parser, errorCode, faultstring, faultcode, requestUUID, iic, wtnic;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 10, , 11]);
                        appArea = req.params.appArea;
                        requestType = req.params.requestType;
                        if (!req.body) {
                            throw new Error('Payload is required!');
                        }
                        xml = req.body.request;
                        contentType = req.headers['content-type'];
                        if (contentType != 'application/json') {
                            throw new Error('Content-Type header must be application/json');
                        }
                        if (!requestType) {
                            throw new Error('RequestType is required!');
                        }
                        if (!xml) {
                            throw new Error('Request field is required!');
                        }
                        if (xml.indexOf(requestType) != 1) {
                            throw new Error('RequestType does not correspond to the request payload');
                        }
                        _a = alf_requestType_request_1.processByRequestType(appArea, requestType, xml), transformedRequest = _a.transformedRequest, skipUplinkRequest = _a.skipUplinkRequest;
                        successResponse = false;
                        response = void 0;
                        if (!!skipUplinkRequest) return [3 /*break*/, 8];
                        signedRequest = alf_requestSignature_1.computeSignedRequest(requestType, transformedRequest, appArea);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        if (!(requestType.toUpperCase() == 'RegisterEinvoiceRequest'.toUpperCase() ||
                            requestType.toUpperCase() == 'GetTaxpayersRequest'.toUpperCase() ||
                            requestType.toUpperCase() == 'GetEInvoicesRequest'.toUpperCase())) return [3 /*break*/, 3];
                        return [4 /*yield*/, alf_request_1.executeRequestEinvoice(signedRequest)];
                    case 2:
                        response = _b.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, alf_request_1.executeRequest(signedRequest)];
                    case 4:
                        response = _b.sent();
                        _b.label = 5;
                    case 5:
                        successResponse = true;
                        return [3 /*break*/, 7];
                    case 6:
                        requestError_1 = _b.sent();
                        parsedError = new DOMParser().parseFromString(requestError_1, 'text/xml');
                        if (parsedError) {
                            response = requestError_1;
                        }
                        else {
                            parsedRequest = new DOMParser().parseFromString(transformedRequest, 'text/xml');
                            requestId = parsedRequest.getElementsByTagName('Header')[0].getAttribute('UUID');
                            response = "<env:Envelop><env:Header/><env:Body><env:Fault><faultcode>dms:REQFAIL</faultcode><detail><code>89219</code></detail><faultstring>" + (requestError_1.message ? requestError_1.message : requestError_1) + "</faultstring><requestUUID>" + requestId + "</requestUUID></env:Fault></env:Body></env:Envelop>";
                        }
                        successResponse = false;
                        return [3 /*break*/, 7];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        successResponse = true;
                        response = transformedRequest;
                        _b.label = 9;
                    case 9:
                        transformedResponse = alf_requestType_response_1.processResponseByRequestType(appArea, requestType, transformedRequest, response, successResponse);
                        transformedResponse.success = successResponse;
                        res.set('Content-Type', 'appplicaion/json').status(200).send(transformedResponse);
                        return [3 /*break*/, 11];
                    case 10:
                        err_1 = _b.sent();
                        console.error(err_1);
                        console.log(err_1.stackTrace);
                        console.log(err_1.stack);
                        parser = new DOMParser().parseFromString(err_1, 'text/xml');
                        if (parser) {
                            errorCode = parser.documentElement.getElementsByTagName('code');
                            faultstring = parser.documentElement.getElementsByTagName('faultstring');
                            faultcode = parser.documentElement.getElementsByTagName('faultcode');
                            requestUUID = parser.documentElement.getElementsByTagName('requestUUID');
                            iic = parser.documentElement.getElementsByTagName('IIC');
                            wtnic = parser.documentElement.getElementsByTagName('WTNIC');
                            this.returnResponseError(res, 400, {
                                success: false,
                                errorCode: errorCode && errorCode.length > 0 ? errorCode[0].textContent : undefined,
                                faultCode: faultcode && faultcode.length > 0 ? faultcode[0].textContent : undefined,
                                faultstring: faultstring && faultstring.length > 0 ? faultstring[0].textContent : undefined,
                                requestUUID: requestUUID && requestUUID.length > 0 ? requestUUID[0].textContent : undefined,
                                iic: iic && iic.length > 0 ? iic[0].textContent : undefined,
                                wtnic: wtnic && wtnic.length > 0 ? wtnic[0].textContent : undefined,
                                rawErrror: err_1
                            });
                        }
                        else {
                            this.returnResponseError(res, 400, {
                                success: false,
                                faultCode: 'dms:GENERALERROR',
                                faultstring: err_1.message ? err_1.message : err_1,
                                requestUUID: '',
                                rawErrror: err_1.message ? err_1.message : err_1,
                                errorCode: 89219
                            });
                        }
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/];
                }
            });
        }); };
        return _this;
    }
    return ALFController;
}(api_controller_base_1.ApiControlerBase));
exports.ALFController = ALFController;
//# sourceMappingURL=alf-controller.js.map