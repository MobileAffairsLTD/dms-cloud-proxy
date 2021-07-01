"use strict";
exports.__esModule = true;
exports.processResponseByRequestType = exports.handleDmsCalculateIICResponse = void 0;
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
        iicSignature: parsedRequest.documentElement.getElementsByTagName('Invoice')[0].getAttribute('IICSignature'),
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
function handleDmsCalculateIICResponse(appArea, requestXml) {
    var parsedRequest = new DOMParser().parseFromString(requestXml, 'text/xml');
    var nuis = parsedRequest.documentElement.getAttribute('NUIS');
    if (!nuis) {
        nuis = parsedRequest.documentElement.getAttribute('IssuerNuis');
    }
    if (!nuis) {
        nuis = parsedRequest.documentElement.getAttribute('IssuerNuis');
    }
    if (!nuis) {
        var seller = parsedRequest.documentElement.getElementsByTagName('Seller');
        if (seller && seller.length > 0) {
            nuis = seller[0].getAttribute('IDNum');
        }
    }
    if (!nuis) {
        throw new Error('IIC calculation erorr: One of Invoice.NUIS, Invoice.IssuerNuis, Seller.IDNum attribute are required');
    }
    if (!parsedRequest.documentElement.getAttribute('IssueDateTime')) {
        throw new Error('IIC calculation erorr: Invoice.IssueDateTime attribute is required');
    }
    if (!parsedRequest.documentElement.getAttribute('InvOrdNum')) {
        throw new Error('IIC calculation erorr: Invoice.InvOrdNum attribute is required');
    }
    if (!parsedRequest.documentElement.getAttribute('BusinUnitCode')) {
        throw new Error('IIC calculation erorr: Invoice.BusinUnitCode attribute is required');
    }
    //TCRCode can be 0 for 
    // if(!parsedRequest.documentElement.getAttribute('TCRCode')){
    //     throw new Error('IIC calculation erorr: Invoice.TCRCode attribute is required');
    // }
    if (!parsedRequest.documentElement.getAttribute('SoftCode')) {
        throw new Error('IIC calculation erorr: Invoice.SoftCode attribute is required');
    }
    if (!parsedRequest.documentElement.getAttribute('TotPrice')) {
        throw new Error('IIC calculation erorr: Invoice.TotPrice attribute is required');
    }
    var iicInput = '';
    //issuerNuis
    iicInput += nuis; //'L01714012M';
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
exports.handleDmsCalculateIICResponse = handleDmsCalculateIICResponse;
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
function handleGetTaxPayersResponse(appArea, requestXml, parsedResponse, isSuccessReponse) {
    var parsedRequest = new DOMParser().parseFromString(requestXml, 'text/xml');
    var Taxpayer = parsedResponse.documentElement.getElementsByTagName('ns2:Taxpayer');
    var Header = parsedResponse.documentElement.getElementsByTagName('Header');
    var taxPayers = [];
    for (var i = -0; i < Taxpayer.length; i++) {
        var node = Taxpayer[i];
        taxPayers.push({
            name: node.getAttribute('Name'),
            tin: node.getAttribute('Tin'),
            town: node.getAttribute('Town'),
            country: node.getAttribute('Country'),
            address: node.getAttribute('Address')
        });
    }
    return {
        //fic: FIC && FIC.length > 0 ? FIC[0].textContent : '',
        //iic: parsedRequest.documentElement.getElementsByTagName('Invoice')[0].getAttribute('IIC'),
        taxPayers: taxPayers,
        requestUUID: Header && Header.length > 0 ? Header[0].getAttribute('RequestUUID') : ''
    };
}
function handleRegisterEInvoiceResponse(appArea, requestXml, parsedResponse, isSuccessReponse) {
    var parsedRequest = new DOMParser().parseFromString(requestXml, 'text/xml');
    var fault = undefined;
    var code = undefined;
    try {
        console.log('RegisterEInvoiceResponse: ' + parsedResponse.documentElement.toString());
    }
    catch (error) {
    }
    var RegisterEInvoiceResponse = parsedResponse.documentElement.getElementsByTagName('ns2:RegisterEinvoiceResponse');
    if (!isSuccessReponse) {
        throw parsedResponse.documentElement.toString();
    }
    else if (!RegisterEInvoiceResponse || RegisterEInvoiceResponse.length != 1) {
        throw new Error('ERROR: Invalid response for RegisterEinvoiceRequest! ' + parsedResponse.documentElement.toString());
    }
    var Header = parsedResponse.documentElement.getElementsByTagName('ns2:Header');
    var eic = parsedResponse.documentElement.getElementsByTagName('ns2:EIC');
    return {
        eic: eic && eic.length > 0 ? eic[0].textContent : '',
        requestUUID: Header && Header.length > 0 ? Header[0].getAttribute('RequestUUID') : ''
    };
}
function handleGetEInvoicesResponse(appArea, requestXml, parsedResponse, isSuccessReponse) {
    var parsedRequest = new DOMParser().parseFromString(requestXml, 'text/xml');
    var Header = parsedResponse.documentElement.getElementsByTagName('Header');
    return {
        requestUUID: Header && Header.length > 0 ? Header[0].getAttribute('RequestUUID') : ''
    };
}
function handleEinvoiceChangeStatusResponse(appArea, requestXml, parsedResponse, isSuccessReponse) {
    var parsedRequest = new DOMParser().parseFromString(requestXml, 'text/xml');
    var Header = parsedResponse.documentElement.getElementsByTagName('Header');
    return {
        requestUUID: Header && Header.length > 0 ? Header[0].getAttribute('RequestUUID') : ''
    };
}
function processResponseByRequestType(appArea, requestType, transformedRequestXml, response, isSuccessReponse) {
    var parsedResponse = new DOMParser().parseFromString(response, 'text/xml');
    var transformedResponse = null;
    if (parsedResponse) {
        switch (requestType.toUpperCase()) {
            case 'RegisterTCRRequest'.toUpperCase():
                transformedResponse = handleRegisterTCRResponse(appArea, transformedRequestXml, parsedResponse, isSuccessReponse);
                break;
            case 'RegisterCashDepositRequest'.toUpperCase():
                transformedResponse = handleRegisterCashDepositResponse(appArea, transformedRequestXml, parsedResponse, isSuccessReponse);
                break;
            case 'RegisterInvoiceRequest'.toUpperCase():
                transformedResponse = handleRegisterInvoiceResponse(appArea, transformedRequestXml, parsedResponse, isSuccessReponse);
                break;
            case 'RegisterWTNRequest'.toUpperCase():
                transformedResponse = handleRegisterWTNResponse(appArea, transformedRequestXml, parsedResponse, isSuccessReponse);
                break;
            case 'DmsCalculateIIC'.toUpperCase():
                transformedResponse = handleDmsCalculateIICResponse(appArea, transformedRequestXml);
                break;
            case 'DmsCalculateWTNIC'.toUpperCase():
                transformedResponse = handleDmsCalculateWTNICResponse(appArea, transformedRequestXml, parsedResponse, isSuccessReponse);
                break;
            case 'RegisterEInvoiceRequest'.toUpperCase():
                transformedResponse = handleRegisterEInvoiceResponse(appArea, transformedRequestXml, parsedResponse, isSuccessReponse);
                break;
            case 'GetTaxpayersRequest'.toUpperCase():
                transformedResponse = handleGetTaxPayersResponse(appArea, transformedRequestXml, parsedResponse, isSuccessReponse);
                break;
            case 'GetEInvoicesRequest'.toUpperCase():
                transformedResponse = handleGetEInvoicesResponse(appArea, transformedRequestXml, parsedResponse, isSuccessReponse);
                break;
            case 'EinvoiceChangeStatusRequest'.toUpperCase():
                transformedResponse = handleEinvoiceChangeStatusResponse(appArea, transformedRequestXml, parsedResponse, isSuccessReponse);
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