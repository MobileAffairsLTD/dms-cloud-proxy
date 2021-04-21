"use strict";
exports.__esModule = true;
exports.processResponseByRequestType = void 0;
var alf_certificate_storage_1 = require("./alf-certificate-storage");
var alf_requestSignature_1 = require("./alf-requestSignature");
var DOMParser = require('xmldom').DOMParser;
function handleRegisterTCRResponse(appArea, requestXml, parsedResponse, isSuccessReponse) {
    var RegisterTCRResponse = parsedResponse.documentElement.getElementsByTagName('RegisterTCRResponse');
    if (!isSuccessReponse) {
        throw parsedResponse.documentElement.toString();
    }
    if (!RegisterTCRResponse || RegisterTCRResponse.length != 1) {
        throw new Error('Invalid response for RegisterTCRRequest');
    }
    var Header = parsedResponse.documentElement.getElementsByTagName('Header');
    var TCRCode = parsedResponse.documentElement.getElementsByTagName('TCRCode');
    return {
        tcrCode: TCRCode && TCRCode.length > 0 ? TCRCode[0].textContent : '',
        requestUUID: Header && Header.length > 0 ? Header[0].getAttribute('RequestUUID') : ''
    };
}
function handleRegisterCashDepositResponse(appArea, requestXml, parsedResponse, isSuccessReponse) {
    var RegisterCashDepositResponse = parsedResponse.documentElement.getElementsByTagName('RegisterCashDepositResponse');
    if (!isSuccessReponse) {
        throw parsedResponse.documentElement.toString();
    }
    if (!RegisterCashDepositResponse || RegisterCashDepositResponse.length != 1) {
        throw new Error('Invalid response for RegisterCashDepositResponse');
    }
    var Header = parsedResponse.documentElement.getElementsByTagName('Header');
    var FCDC = parsedResponse.documentElement.getElementsByTagName('FCDC');
    return {
        fcdc: FCDC && FCDC.length > 0 ? FCDC[0].textContent : null,
        requestUUID: Header && Header.length > 0 ? Header[0].getAttribute('RequestUUID') : ''
    };
}
function handleRegisterInvoiceResponse(appArea, requestXml, parsedResponse, isSuccessReponse) {
    var parsedRequest = new DOMParser().parseFromString(requestXml, 'text/xml');
    var RegisterInvoiceResponse = parsedResponse.documentElement.getElementsByTagName('RegisterInvoiceResponse');
    if (!isSuccessReponse) {
        var iic = parsedResponse.createElement('IIC');
        iic.innerText = parsedRequest.documentElement.getElementsByTagName('Invoice')[0].getAttribute('IIC');
        iic.textContent = parsedRequest.documentElement.getElementsByTagName('Invoice')[0].getAttribute('IIC');
        var c = parsedResponse.documentElement.toString();
        parsedResponse.documentElement.getElementsByTagName('env:Fault')[0].appendChild(iic);
        throw parsedResponse.documentElement.toString();
    }
    else if (!RegisterInvoiceResponse || RegisterInvoiceResponse.length != 1) {
        throw new Error('Invalid response for RegisterInvoiceResponse');
    }
    var Header = parsedResponse.documentElement.getElementsByTagName('Header');
    var FIC = parsedResponse.documentElement.getElementsByTagName('FIC');
    if (!FIC || FIC.length == 0) {
        throw 'FIC was not returned';
    }
    return {
        fic: FIC && FIC.length > 0 ? FIC[0].textContent : '',
        iic: parsedRequest.documentElement.getElementsByTagName('Invoice')[0].getAttribute('IIC'),
        requestUUID: Header && Header.length > 0 ? Header[0].getAttribute('RequestUUID') : ''
    };
}
function handleRegisterWTNResponse(appArea, requestXml, parsedResponse, isSuccessReponse) {
    var parsedRequest = new DOMParser().parseFromString(requestXml, 'text/xml');
    var RegisterWTNResponse = parsedResponse.documentElement.getElementsByTagName('RegisterWTNResponse');
    if (!isSuccessReponse) {
        var iic = parsedResponse.createElement('WTNIC');
        iic.innerText = parsedRequest.documentElement.getElementsByTagName('WTN')[0].getAttribute('WTNIC');
        iic.textContent = parsedRequest.documentElement.getElementsByTagName('WTN')[0].getAttribute('WTNIC');
        var c = parsedResponse.documentElement.toString();
        parsedResponse.documentElement.getElementsByTagName('env:Fault')[0].appendChild(iic);
        throw parsedResponse.documentElement.toString();
    }
    else if (!RegisterWTNResponse || RegisterWTNResponse.length != 1) {
        throw new Error('Invalid response for RegisterWTNResponse');
    }
    var Header = parsedResponse.documentElement.getElementsByTagName('Header');
    var FWTNIC = parsedResponse.documentElement.getElementsByTagName('FWTNIC');
    if (!FWTNIC || FWTNIC.length == 0) {
        throw 'FWTNIC was not returned';
    }
    return {
        fwtnic: FWTNIC && FWTNIC.length > 0 ? FWTNIC[0].textContent : '',
        wtnic: parsedRequest.documentElement.getElementsByTagName('WTN')[0].getAttribute('WTNIC'),
        requestUUID: Header && Header.length > 0 ? Header[0].getAttribute('RequestUUID') : ''
    };
}
function handleDmsCalculateIICResponse(appArea, requestXml, parsedResponse, isSuccessReponse) {
    var parsedRequest = new DOMParser().parseFromString(requestXml, 'text/xml');
    var iicInput = '';
    //issuerNuis
    iicInput += parsedRequest.documentElement.getAttribute('NUIS');
    //dateTimeCreated
    iicInput += "|" + parsedRequest.documentElement.getAttribute('IssueDateTime');
    //invoiceNumber
    iicInput += "|" + parsedRequest.documentElement.getAttribute('InvOrdNum');
    //busiUnitCode
    iicInput += "|" + parsedRequest.documentElement.getAttribute('BusinUnitCode');
    //tcrCode
    iicInput += "|" + parsedRequest.documentElement.getAttribute('TCRCode');
    //softCode
    iicInput += "|" + parsedRequest.documentElement.getAttribute('SoftCode');
    //totalPrice
    iicInput += "|" + parsedRequest.documentElement.getAttribute('TotPrice');
    var _a = alf_requestSignature_1.calculateISC(alf_certificate_storage_1.getPrivateCertificate(appArea), iicInput), iscHash = _a.iscHash, iscSignature = _a.iscSignature;
    return {
        iic: iscHash,
        iicSignature: iscSignature
    };
}
function handleDmsCalculateWTNICResponse(appArea, requestXml, parsedResponse, isSuccessReponse) {
    var parsedRequest = new DOMParser().parseFromString(requestXml, 'text/xml');
    var iicInput = '';
    //issuerNuis
    iicInput += parsedRequest.documentElement.getAttribute('NUIS');
    //dateTimeCreated
    iicInput += "|" + parsedRequest.documentElement.getAttribute('IssueDateTime');
    //invoiceNumber
    iicInput += "|" + parsedRequest.documentElement.getAttribute('WTNOrdNum');
    //busiUnitCode
    iicInput += "|" + parsedRequest.documentElement.getAttribute('BusinUnitCode');
    //softCode
    iicInput += "|" + parsedRequest.documentElement.getAttribute('SoftCode');
    var _a = alf_requestSignature_1.calculateISC(alf_certificate_storage_1.getPrivateCertificate(appArea), iicInput), iscHash = _a.iscHash, iscSignature = _a.iscSignature;
    return {
        wtnic: iscHash,
        wtnicSignature: iscSignature
    };
}
function handleRegisterEInvoiceResponse(appArea, requestXml, parsedResponse, isSuccessReponse) {
    var parsedRequest = new DOMParser().parseFromString(requestXml, 'text/xml');
    var RegisterEInvoiceResponse = parsedResponse.documentElement.getElementsByTagName('RegisterInvoiceResponse');
    if (!isSuccessReponse) {
        // const iic = parsedResponse.createElement('IIC')
        // iic.innerText = parsedRequest.documentElement.getElementsByTagName('Invoice')[0].getAttribute('IIC');
        // iic.textContent = parsedRequest.documentElement.getElementsByTagName('Invoice')[0].getAttribute('IIC');
        // const c = parsedResponse.documentElement.toString();
        // parsedResponse.documentElement.getElementsByTagName('env:Fault')[0].appendChild(iic)
        // throw parsedResponse.documentElement.toString();
    }
    else if (!RegisterEInvoiceResponse || RegisterEInvoiceResponse.length != 1) {
        throw new Error('Invalid response for RegisterEInvoiceResponse');
    }
    var Header = parsedResponse.documentElement.getElementsByTagName('Header');
    //const FIC = parsedResponse.documentElement.getElementsByTagName('FIC');
    // if (!FIC || FIC.length == 0) {
    //     throw 'FIC was not returned'
    // }
    return {
        //fic: FIC && FIC.length > 0 ? FIC[0].textContent : '',
        //iic: parsedRequest.documentElement.getElementsByTagName('Invoice')[0].getAttribute('IIC'),
        requestUUID: Header && Header.length > 0 ? Header[0].getAttribute('RequestUUID') : ''
    };
}
function processResponseByRequestType(appArea, requestType, transformedRequestXml, response, isSuccessReponse) {
    var parsedResponse = new DOMParser().parseFromString(response, 'text/xml');
    var transformedResponse = null;
    if (parsedResponse) {
        switch (requestType) {
            case 'RegisterTCRRequest':
                transformedResponse = handleRegisterTCRResponse(appArea, transformedRequestXml, parsedResponse, isSuccessReponse);
                break;
            case 'RegisterCashDepositRequest':
                transformedResponse = handleRegisterCashDepositResponse(appArea, transformedRequestXml, parsedResponse, isSuccessReponse);
                break;
            case 'RegisterInvoiceRequest':
                transformedResponse = handleRegisterInvoiceResponse(appArea, transformedRequestXml, parsedResponse, isSuccessReponse);
                break;
            case 'RegisterWTNRequest':
                transformedResponse = handleRegisterWTNResponse(appArea, transformedRequestXml, parsedResponse, isSuccessReponse);
                break;
            case 'DmsCalculateIIC':
                transformedResponse = handleDmsCalculateIICResponse(appArea, transformedRequestXml, parsedResponse, isSuccessReponse);
                break;
            case 'DmsCalculateWTNIC':
                transformedResponse = handleDmsCalculateWTNICResponse(appArea, transformedRequestXml, parsedResponse, isSuccessReponse);
                break;
            case 'RegisterEInvoiceRequest':
                transformedResponse = handleRegisterEInvoiceResponse(appArea, transformedRequestXml, parsedResponse, isSuccessReponse);
                break;
            default: throw new Error('Unkown request type');
        }
        if (transformedResponse) {
            transformedResponse.rawResponse = response;
            return transformedResponse;
        }
    }
    else {
        //response is not XML
        throw new Error(response);
    }
}
exports.processResponseByRequestType = processResponseByRequestType;
//# sourceMappingURL=alf-requestType-response.js.map