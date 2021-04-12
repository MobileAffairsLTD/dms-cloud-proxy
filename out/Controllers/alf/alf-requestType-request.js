"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DOMParser = require('xmldom').DOMParser;
function handleRegisterInvoice(parser) {
    var Invoice = parser.documentElement.getElementsByTagName('Invoice1');
    if (!Invoice || Invoice.length != 1) {
        throw new Error('Invalid RegisterInvoiceRequest: Invoice element is missing');
    }
    return parser.textContent;
}
function processByRequestType(requestType, xml) {
    var parser = new DOMParser().parseFromString(xml, 'text/xml');
    if (parser) {
        switch (requestType) {
            case 'RegisterTCRRequest': return xml;
            case 'RegisterCashDepositRequest': return xml;
            case 'RegisterInvoiceRequest': return handleRegisterInvoice(parser);
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