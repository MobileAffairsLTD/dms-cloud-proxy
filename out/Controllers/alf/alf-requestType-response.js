"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        requestUUID: Header && Header.length > 0 ? Header[0].getAttribute('RequestUUID') : '',
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
        requestUUID: Header && Header.length > 0 ? Header[0].getAttribute('RequestUUID') : '',
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
        requestUUID: Header && Header.length > 0 ? Header[0].getAttribute('RequestUUID') : '',
    };
}
function handleDmsCalculateISCResponse(appArea, requestXml, parsedResponse, isSuccessReponse) {
    var parsedRequest = new DOMParser().parseFromString(requestXml, 'text/xml');
    var iicInput = '';
    //issuerNuis
    iicInput += parsedRequest.documentElement.getAttribute('IssuerNuis');
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
        iscSignature: iscSignature
    };
}
function processResponseByRequestType(appArea, requestType, transformedRequestXml, response, isSuccessReponse) {
    var parsedResponse = new DOMParser().parseFromString(response, 'text/xml');
    var transformedTesponse = null;
    if (parsedResponse) {
        switch (requestType) {
            case 'RegisterTCRRequest':
                transformedTesponse = handleRegisterTCRResponse(appArea, transformedRequestXml, parsedResponse, isSuccessReponse);
                break;
            case 'RegisterCashDepositRequest':
                transformedTesponse = handleRegisterCashDepositResponse(appArea, transformedRequestXml, parsedResponse, isSuccessReponse);
                break;
            case 'RegisterInvoiceRequest':
                transformedTesponse = handleRegisterInvoiceResponse(appArea, transformedRequestXml, parsedResponse, isSuccessReponse);
                break;
            case 'DmsCalculateISC':
                transformedTesponse = handleDmsCalculateISCResponse(appArea, transformedRequestXml, parsedResponse, isSuccessReponse);
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