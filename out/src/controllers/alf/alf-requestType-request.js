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
exports.processByRequestType = void 0;
var alf_certificate_storage_1 = require("./alf-certificate-storage");
var alf_requestSignature_1 = require("./alf-requestSignature");
var DOMParser = require('xmldom').DOMParser;
function handleRegisterInvoiceRequest(appArea, parser) {
    var Invoice = parser.documentElement.getElementsByTagName('Invoice');
    if (!Invoice || Invoice.length != 1) {
        throw new Error('Invalid RegisterInvoiceRequest: Invoice element is missing');
    }
    var Seller = parser.documentElement.getElementsByTagName('Seller');
    if (!Seller || Seller.length != 1) {
        throw new Error('Invalid RegisterInvoiceRequest: Seller element is missing');
    }
    var issuerNuis = Seller[0].getAttribute('IDNum');
    var iicInput = '';
    //issuerNuis
    iicInput += issuerNuis;
    //dateTimeCreated
    iicInput += "|" + Invoice[0].getAttribute('IssueDateTime');
    //invoiceNumber
    iicInput += "|" + Invoice[0].getAttribute('InvOrdNum');
    //busiUnitCode
    iicInput += "|" + Invoice[0].getAttribute('BusinUnitCode');
    //tcrCode
    iicInput += "|" + Invoice[0].getAttribute('TCRCode');
    //softCode
    iicInput += "|" + Invoice[0].getAttribute('SoftCode');
    //totalPrice
    iicInput += "|" + Invoice[0].getAttribute('TotPrice');
    var _a = alf_requestSignature_1.calculateISC(alf_certificate_storage_1.getPrivateCertificate(appArea), iicInput), iscHash = _a.iscHash, iscSignature = _a.iscSignature;
    parser.getElementsByTagName('Invoice')[0].setAttribute('IIC', iscHash);
    parser.getElementsByTagName('Invoice')[0].setAttribute('IICSignature', iscSignature);
    return parser.documentElement.toLocaleString();
}
function handleRegisterWTNRequest(appArea, parser) {
    var WTN = parser.documentElement.getElementsByTagName('WTN');
    if (!WTN || WTN.length != 1) {
        throw new Error('Invalid RegisterWTNRequest: WTN element is missing');
    }
    var Issuer = parser.documentElement.getElementsByTagName('Issuer');
    if (!Issuer || Issuer.length != 1) {
        throw new Error('Invalid RegisterWTNRequest: Issuer element is missing');
    }
    var issuerNuis = Issuer[0].getAttribute('NUIS');
    var iicInput = '';
    //issuerNuis
    iicInput += issuerNuis;
    //dateTimeCreated
    iicInput += "|" + WTN[0].getAttribute('IssueDateTime');
    //invoiceNumber
    iicInput += "|" + WTN[0].getAttribute('WTNOrdNum');
    //busiUnitCode
    iicInput += "|" + WTN[0].getAttribute('BusinUnitCode');
    //softCode
    iicInput += "|" + WTN[0].getAttribute('SoftCode');
    var _a = alf_requestSignature_1.calculateISC(alf_certificate_storage_1.getPrivateCertificate(appArea), iicInput), iscHash = _a.iscHash, iscSignature = _a.iscSignature;
    parser.getElementsByTagName('WTN')[0].setAttribute('WTNIC', iscHash);
    parser.getElementsByTagName('WTN')[0].setAttribute('WTNICSignature', iscSignature);
    return parser.documentElement.toLocaleString();
}
function handleRegisterDmsCalculateIICRequest(appArea, parser) {
    var parsedRequest = parser;
    //issuerNuis
    var errors = [];
    if (!parsedRequest.documentElement.getAttribute('IssuerNuis')) {
        errors.push('Attribute IssuerNuis is required');
    }
    if (!parsedRequest.documentElement.getAttribute('IssueDateTime')) {
        errors.push('Attribute IssueDateTime is required');
    }
    if (!parsedRequest.documentElement.getAttribute('InvOrdNum')) {
        errors.push('Attribute InvOrdNum is required');
    }
    if (!parsedRequest.documentElement.getAttribute('BusinUnitCode')) {
        errors.push('Attribute BusinUnitCode is required');
    }
    if (!parsedRequest.documentElement.getAttribute('SoftCode')) {
        errors.push('Attribute SoftCode is required');
    }
    if (!parsedRequest.documentElement.getAttribute('TotPrice')) {
        errors.push('Attribute TotPrice is required');
    }
    if (errors.length > 0) {
        throw new Error(errors.join(';'));
    }
    return parser.documentElement.toString();
}
function handleRegisterDmsCalculateWTNICRequest(appArea, parser) {
    var parsedRequest = parser;
    //issuerNuis
    var errors = [];
    if (!parsedRequest.documentElement.getAttribute('IssuerNuis')) {
        errors.push('Attribute IssuerNuis is required');
    }
    if (!parsedRequest.documentElement.getAttribute('IssueDateTime')) {
        errors.push('Attribute IssueDateTime is required');
    }
    if (!parsedRequest.documentElement.getAttribute('WTNOrdNum')) {
        errors.push('Attribute WTNOrdNum is required');
    }
    if (!parsedRequest.documentElement.getAttribute('BusinUnitCode')) {
        errors.push('Attribute BusinUnitCode is required');
    }
    if (!parsedRequest.documentElement.getAttribute('SoftCode')) {
        errors.push('Attribute SoftCode is required');
    }
    if (errors.length > 0) {
        throw new Error(errors.join(';'));
    }
    return "<response></response>";
}
function handleRegisterRawEInvoiceRequest(appArea, parser) {
    return __awaiter(this, void 0, void 0, function () {
        var terminatingString, defaultCurrency, Invoice, invoiceDom, Header, custId, UBLExtensions, UBLExtension, ExtensionContent, UBLDocumentSignatures, SignatureInformation, pureSignature, signatureElement, finalEInvoiceXml, buff, invoiceAsBase64, request;
        return __generator(this, function (_a) {
            terminatingString = '#AAI#';
            defaultCurrency = 'ALL';
            Invoice = parser.documentElement.getElementsByTagName('ns8:Invoice');
            if (!Invoice || Invoice.length != 1) {
                throw new Error('Invalid RegisterEInvoiceRequest: Invoice element is missing');
            }
            invoiceDom = new DOMParser().parseFromString(Invoice.toString(), 'text/xml');
            Header = parser.documentElement.getElementsByTagName('Header');
            if (!Header || Header.length != 1) {
                throw new Error('Invalid RegisterEInvoiceRequest: Header element is missing');
            }
            if (parser.documentElement.childNodes.length < 2) {
                throw new Error('Invalid RegisterEInvoiceRequest: Header and Invoice elements are requird');
            }
            custId = invoiceDom.documentElement.getElementsByTagName('CustomizationID');
            if (custId.length > 0) {
                custId = custId[0];
            }
            else
                custId = undefined;
            UBLExtensions = appendEmptyXmlElement(invoiceDom.documentElement, 'ns2:UBLExtensions', custId);
            UBLExtension = appendEmptyXmlElement(UBLExtensions, 'ns2:UBLExtension');
            ExtensionContent = appendEmptyXmlElement(UBLExtension, 'ns2:ExtensionContent');
            UBLDocumentSignatures = appendEmptyXmlElement(ExtensionContent, 'ns7:UBLDocumentSignatures');
            SignatureInformation = appendEmptyXmlElement(UBLDocumentSignatures, 'ns6:SignatureInformation');
            pureSignature = alf_requestSignature_1.computeEinvoiceSignature('Invoice', invoiceDom.toString(), appArea);
            signatureElement = new DOMParser().parseFromString(pureSignature, 'text/xml');
            SignatureInformation.appendChild(signatureElement.documentElement);
            finalEInvoiceXml = invoiceDom.documentElement.toString();
            buff = Buffer.from(finalEInvoiceXml);
            invoiceAsBase64 = buff.toString('base64');
            request = "<RegisterEinvoiceRequest xmlns=\"https://Einvoice.tatime.gov.al/EinvoiceService/schema\" xmlns:ns2=\"http://www.w3.org/2000/09/xmldsig#\" Id=\"Request\" Version=\"1\">" + Header[0].toString() + "<EinvoiceEnvelope><UblInvoice>" + invoiceAsBase64 + "</UblInvoice></EinvoiceEnvelope></RegisterEinvoiceRequest>";
            return [2 /*return*/, request];
        });
    });
}
function processByRequestType(appArea, requestType, xml) {
    return __awaiter(this, void 0, void 0, function () {
        var parser, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    parser = new DOMParser().parseFromString(xml, 'text/xml');
                    if (!parser) return [3 /*break*/, 14];
                    _a = requestType.toUpperCase();
                    switch (_a) {
                        case 'RegisterTCRRequest'.toUpperCase(): return [3 /*break*/, 1];
                        case 'RegisterCashDepositRequest'.toUpperCase(): return [3 /*break*/, 2];
                        case 'RegisterInvoiceRequest'.toUpperCase(): return [3 /*break*/, 3];
                        case 'RegisterWTNRequest'.toUpperCase(): return [3 /*break*/, 4];
                        case 'DmsCalculateIIC'.toUpperCase(): return [3 /*break*/, 5];
                        case 'DmsCalculateWTNIC'.toUpperCase(): return [3 /*break*/, 6];
                        case 'RegisterEInvoiceRequest'.toUpperCase(): return [3 /*break*/, 7];
                        case 'GetTaxpayersRequest'.toUpperCase(): return [3 /*break*/, 9];
                        case 'GetEInvoicesRequest'.toUpperCase(): return [3 /*break*/, 10];
                        case 'EinvoiceChangeStatusRequest'.toUpperCase(): return [3 /*break*/, 11];
                    }
                    return [3 /*break*/, 12];
                case 1: return [2 /*return*/, { transformedRequest: xml, skipUplinkRequest: false }];
                case 2: return [2 /*return*/, { transformedRequest: xml, skipUplinkRequest: false }];
                case 3: return [2 /*return*/, { transformedRequest: handleRegisterInvoiceRequest(appArea, parser), skipUplinkRequest: false }];
                case 4: return [2 /*return*/, { transformedRequest: handleRegisterWTNRequest(appArea, parser), skipUplinkRequest: false }];
                case 5: return [2 /*return*/, { transformedRequest: handleRegisterDmsCalculateIICRequest(appArea, parser), skipUplinkRequest: true }];
                case 6: return [2 /*return*/, { transformedRequest: handleRegisterDmsCalculateWTNICRequest(appArea, parser), skipUplinkRequest: true }];
                case 7:
                    _b = {};
                    return [4 /*yield*/, handleRegisterRawEInvoiceRequest(appArea, parser)];
                case 8: return [2 /*return*/, (_b.transformedRequest = _c.sent(), _b.skipUplinkRequest = false, _b)];
                case 9: return [2 /*return*/, { transformedRequest: xml, skipUplinkRequest: false }];
                case 10: return [2 /*return*/, { transformedRequest: xml, skipUplinkRequest: false }];
                case 11: return [2 /*return*/, { transformedRequest: xml, skipUplinkRequest: false }];
                case 12: throw new Error('Unkown request type');
                case 13: return [3 /*break*/, 15];
                case 14: 
                //response is not XML
                throw new Error('Invalid request xml!');
                case 15: return [2 /*return*/];
            }
        });
    });
}
exports.processByRequestType = processByRequestType;
function appendEmptyXmlElement(cleanInvoiceXmlDom, elementName, beforeElement) {
    var newElement = cleanInvoiceXmlDom.ownerDocument.createElement(elementName);
    if (beforeElement) {
        cleanInvoiceXmlDom.insertBefore(newElement, beforeElement);
    }
    else {
        cleanInvoiceXmlDom.appendChild(newElement);
    }
    return newElement;
}
//# sourceMappingURL=alf-requestType-request.js.map