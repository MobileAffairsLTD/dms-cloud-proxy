"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DOMParser = require('xmldom').DOMParser;
function handleRegisterTCR(parser) {
    var RegisterTCRResponse = parser.documentElement.getElementsByTagName('RegisterTCRResponse');
    if (!RegisterTCRResponse || RegisterTCRResponse.length != 1) {
        throw new Error('Invalid response for RegisterTCRRequest');
    }
    var Header = parser.documentElement.getElementsByTagName('Header');
    var TCRCode = parser.documentElement.getElementsByTagName('TCRCode');
    return {
        tcrCode: TCRCode && TCRCode.length > 0 ? TCRCode[0].textContent : '',
        requestUUID: Header && Header.length > 0 ? Header[0].getAttribute('RequestUUID') : '',
    };
}
function handleRegisterCashDeposit(parser) {
    var RegisterCashDepositResponse = parser.documentElement.getElementsByTagName('RegisterCashDepositResponse');
    if (!RegisterCashDepositResponse || RegisterCashDepositResponse.length != 1) {
        throw new Error('Invalid response for RegisterCashDepositResponse');
    }
    var Header = parser.documentElement.getElementsByTagName('Header');
    var FCDC = parser.documentElement.getElementsByTagName('FCDC');
    return {
        fcdc: FCDC && FCDC.length > 0 ? FCDC[0].textContent : null,
        requestUUID: Header && Header.length > 0 ? Header[0].getAttribute('RequestUUID') : '',
    };
}
function handleRegisterInvoice(parser) {
    var RegisterInvoiceResponse = parser.documentElement.getElementsByTagName('RegisterInvoiceResponse');
    if (!RegisterInvoiceResponse || RegisterInvoiceResponse.length != 1) {
        throw new Error('Invalid response for RegisterInvoiceResponse');
    }
    var Header = parser.documentElement.getElementsByTagName('Header');
    return {
        requestUUID: Header && Header.length > 0 ? Header[0].getAttribute('RequestUUID') : '',
    };
}
function processResponseByRequestType(requestType, response) {
    var parser = new DOMParser().parseFromString(response, 'text/xml');
    var transformedTesponse = null;
    if (parser) {
        switch (requestType) {
            case 'RegisterTCRRequest':
                transformedTesponse = handleRegisterTCR(parser);
                break;
            case 'RegisterCashDepositRequest':
                transformedTesponse = handleRegisterCashDeposit(parser);
                break;
            case 'RegisterInvoiceRequest':
                transformedTesponse = handleRegisterInvoice(parser);
                break;
            default: throw new Error('Unkown request type');
        }
        if (transformedTesponse) {
            transformedTesponse.rawResponse = response;
            return transformedTesponse;
        }
    }
    else {
        //response is not XML
        throw new Error(response);
    }
}
exports.processResponseByRequestType = processResponseByRequestType;
//# sourceMappingURL=alf-requestType-response.js.map