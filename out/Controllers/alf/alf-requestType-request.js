"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const alf_certificate_storage_1 = require("./alf-certificate-storage");
const alf_requestSignature_1 = require("./alf-requestSignature");
const DOMParser = require('xmldom').DOMParser;
function handleRegisterInvoiceRequest(appArea, parser) {
    const Invoice = parser.documentElement.getElementsByTagName('Invoice');
    if (!Invoice || Invoice.length != 1) {
        throw new Error('Invalid RegisterInvoiceRequest: Invoice element is missing');
    }
    const issuerNuis = 'L01714012M';
    let iicInput = '';
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
    const { iscHash, iscSignature } = alf_requestSignature_1.calculateISC(alf_certificate_storage_1.getPrivateCertificate(appArea), iicInput);
    parser.getElementsByTagName('Invoice')[0].setAttribute('IIC', iscHash);
    parser.getElementsByTagName('Invoice')[0].setAttribute('IICSignature', iscSignature);
    return parser.documentElement.toLocaleString();
}
function handleRegisterWTNRequest(appArea, parser) {
    const Invoice = parser.documentElement.getElementsByTagName('WTN');
    if (!Invoice || Invoice.length != 1) {
        throw new Error('Invalid RegisterWTNRequest: WTN element is missing');
    }
    const issuerNuis = 'L01714012M';
    let iicInput = '';
    //issuerNuis
    iicInput += issuerNuis;
    //dateTimeCreated
    iicInput += "|" + Invoice[0].getAttribute('IssueDateTime');
    //invoiceNumber
    iicInput += "|" + Invoice[0].getAttribute('WTNOrdNum');
    //busiUnitCode
    iicInput += "|" + Invoice[0].getAttribute('BusinUnitCode');
    //softCode
    iicInput += "|" + Invoice[0].getAttribute('SoftCode');
    const { iscHash, iscSignature } = alf_requestSignature_1.calculateISC(alf_certificate_storage_1.getPrivateCertificate(appArea), iicInput);
    parser.getElementsByTagName('WTN')[0].setAttribute('WTNIC', iscHash);
    parser.getElementsByTagName('WTN')[0].setAttribute('WTNICSignature', iscSignature);
    return parser.documentElement.toLocaleString();
}
function handleRegisterDmsCalculateIICRequest(appArea, parser) {
    const parsedRequest = parser;
    //issuerNuis
    const errors = [];
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
function handleRegisterDmsCalculateWTNICRequest(appArea, parser) {
    const parsedRequest = parser;
    //issuerNuis
    const errors = [];
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
function processByRequestType(appArea, requestType, xml) {
    const parser = new DOMParser().parseFromString(xml, 'text/xml');
    if (parser) {
        switch (requestType) {
            case 'RegisterTCRRequest': return { transformedRequest: xml, skipUplinkRequest: false };
            case 'RegisterCashDepositRequest': return { transformedRequest: xml, skipUplinkRequest: false };
            case 'RegisterInvoiceRequest': return { transformedRequest: handleRegisterInvoiceRequest(appArea, parser), skipUplinkRequest: false };
            case 'RegisterWTNRequest': return { transformedRequest: handleRegisterWTNRequest(appArea, parser), skipUplinkRequest: false };
            case 'DmsCalculateIIC': return { transformedRequest: handleRegisterDmsCalculateIICRequest(appArea, parser), skipUplinkRequest: true };
            case 'DmsCalculateWTNIC': return { transformedRequest: handleRegisterDmsCalculateWTNICRequest(appArea, parser), skipUplinkRequest: true };
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