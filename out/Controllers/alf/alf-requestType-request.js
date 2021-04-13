"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var alf_certificate_storage_1 = require("./alf-certificate-storage");
var alf_requestSignature_1 = require("./alf-requestSignature");
var DOMParser = require('xmldom').DOMParser;
function handleRegisterInvoiceRequest(appArea, parser) {
    var Invoice = parser.documentElement.getElementsByTagName('Invoice');
    if (!Invoice || Invoice.length != 1) {
        throw new Error('Invalid RegisterInvoiceRequest: Invoice element is missing');
    }
    var issuerNuis = 'L01714012M';
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
function handleRegisterDmsCalculateISCRequest(appArea, parser) {
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
    if (!parsedRequest.documentElement.getAttribute('TCRCode')) {
        errors.push('Attribute TCRCode is required');
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
    return "<response></response>";
}
function processByRequestType(appArea, requestType, xml) {
    var parser = new DOMParser().parseFromString(xml, 'text/xml');
    if (parser) {
        switch (requestType) {
            case 'RegisterTCRRequest': return { transformedRequest: xml, skipUplinkRequest: false };
            case 'RegisterCashDepositRequest': return { transformedRequest: xml, skipUplinkRequest: false };
            case 'RegisterInvoiceRequest': return { transformedRequest: handleRegisterInvoiceRequest(appArea, parser), skipUplinkRequest: false };
            case 'DmsCalculateISC': return { transformedRequest: handleRegisterDmsCalculateISCRequest(appArea, parser), skipUplinkRequest: true };
            default: throw new Error('Unkown request type');
        }
    }
    else {
        //response is not XML
        throw new Error('Invalid request xml!');
    }
}
exports.processByRequestType = processByRequestType;
//# sourceMappingURL=alf-requestType-request.js.map