import { getPrivateCertificate } from "./alf-certificate-storage";
import { calculateISC } from "./alf-requestSignature";

const DOMParser = require('xmldom').DOMParser;

type Document = any;

function handleRegisterTCRResponse(appArea: string, requestXml: string, parsedResponse: Document, isSuccessReponse: boolean): Record<string, any> {
    const RegisterTCRResponse = parsedResponse.documentElement.getElementsByTagName('RegisterTCRResponse');
    if(!isSuccessReponse){
        throw parsedResponse.documentElement.toString();
    } 
    if (!RegisterTCRResponse || RegisterTCRResponse.length != 1) {
        throw new Error('Invalid response for RegisterTCRRequest');
    }
    const Header = parsedResponse.documentElement.getElementsByTagName('Header');
    const TCRCode = parsedResponse.documentElement.getElementsByTagName('TCRCode');
    return {
        tcrCode: TCRCode && TCRCode.length > 0 ? TCRCode[0].textContent : '',
        requestUUID: Header && Header.length > 0 ? Header[0].getAttribute('RequestUUID') : '',
    }
}

function handleRegisterCashDepositResponse(appArea: string, requestXml: string, parsedResponse: Document, isSuccessReponse: boolean): Record<string, any> {
    const RegisterCashDepositResponse = parsedResponse.documentElement.getElementsByTagName('RegisterCashDepositResponse');
    if(!isSuccessReponse){
        throw parsedResponse.documentElement.toString();
    } 
    if (!RegisterCashDepositResponse || RegisterCashDepositResponse.length != 1) {
        throw new Error('Invalid response for RegisterCashDepositResponse');
    }
    const Header = parsedResponse.documentElement.getElementsByTagName('Header');
    const FCDC = parsedResponse.documentElement.getElementsByTagName('FCDC');
    return {
        fcdc: FCDC && FCDC.length > 0 ? FCDC[0].textContent : null,
        requestUUID: Header && Header.length > 0 ? Header[0].getAttribute('RequestUUID') : '',
    }
}

function handleRegisterInvoiceResponse(appArea: string, requestXml: string, parsedResponse: Document, isSuccessReponse: boolean): Record<string, any> {
    const parsedRequest = new DOMParser().parseFromString(requestXml, 'text/xml');

    const RegisterInvoiceResponse = parsedResponse.documentElement.getElementsByTagName('RegisterInvoiceResponse');
    if (!isSuccessReponse) {
        const iic = parsedResponse.createElement('IIC')
        iic.innerText = parsedRequest.documentElement.getElementsByTagName('Invoice')[0].getAttribute('IIC');
        iic.textContent = parsedRequest.documentElement.getElementsByTagName('Invoice')[0].getAttribute('IIC');
        const c = parsedResponse.documentElement.toString();
        parsedResponse.documentElement.getElementsByTagName('env:Fault')[0].appendChild(iic)
        throw parsedResponse.documentElement.toString();
    }
    else
        if (!RegisterInvoiceResponse || RegisterInvoiceResponse.length != 1) {

            throw new Error('Invalid response for RegisterInvoiceResponse');
        }
    const Header = parsedResponse.documentElement.getElementsByTagName('Header');
    const FIC = parsedResponse.documentElement.getElementsByTagName('FIC');

    if (!FIC || FIC.length == 0) {
        throw 'FIC was not returned'
    }




    return {
        fic: FIC && FIC.length > 0 ? FIC[0].textContent : '',
        iic: parsedRequest.documentElement.getElementsByTagName('Invoice')[0].getAttribute('IIC'),
        requestUUID: Header && Header.length > 0 ? Header[0].getAttribute('RequestUUID') : '',
    }
}

function handleRegisterWTNResponse(appArea: string, requestXml: string, parsedResponse: Document, isSuccessReponse: boolean): Record<string, any> {
    const parsedRequest = new DOMParser().parseFromString(requestXml, 'text/xml');

    const RegisterWTNResponse = parsedResponse.documentElement.getElementsByTagName('RegisterWTNResponse');
    if (!isSuccessReponse) {
        const iic = parsedResponse.createElement('WTNIC')
        iic.innerText = parsedRequest.documentElement.getElementsByTagName('WTN')[0].getAttribute('WTNIC');
        iic.textContent = parsedRequest.documentElement.getElementsByTagName('WTN')[0].getAttribute('WTNIC');
        const c = parsedResponse.documentElement.toString();
        parsedResponse.documentElement.getElementsByTagName('env:Fault')[0].appendChild(iic)
        throw parsedResponse.documentElement.toString();
    }
    else
        if (!RegisterWTNResponse || RegisterWTNResponse.length != 1) {

            throw new Error('Invalid response for RegisterWTNResponse');
        }
    const Header = parsedResponse.documentElement.getElementsByTagName('Header');
    const FWTNIC= parsedResponse.documentElement.getElementsByTagName('FWTNIC');

    if (!FWTNIC || FWTNIC.length == 0) {
        throw 'FWTNIC was not returned'
    }

    return {
        fwtnic: FWTNIC && FWTNIC.length > 0 ? FWTNIC[0].textContent : '',
        wtnic: parsedRequest.documentElement.getElementsByTagName('WTN')[0].getAttribute('WTNIC'),
        requestUUID: Header && Header.length > 0 ? Header[0].getAttribute('RequestUUID') : '',
    }
}


function handleDmsCalculateIICResponse(appArea: string, requestXml: string, parsedResponse: Document, isSuccessReponse: boolean): Record<string, any> {
    const parsedRequest = new DOMParser().parseFromString(requestXml, 'text/xml');
    let iicInput = '';
    //issuerNuis
    iicInput +=  parsedRequest.documentElement.getAttribute('NUIS');
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
    const { iscHash, iscSignature } = calculateISC(getPrivateCertificate(appArea), iicInput);
       return {       
        iic: iscHash,
        iicSignature: iscSignature
    }
}

function handleDmsCalculateWTNICResponse(appArea: string, requestXml: string, parsedResponse: Document, isSuccessReponse: boolean): Record<string, any> {
    const parsedRequest = new DOMParser().parseFromString(requestXml, 'text/xml');
    let iicInput = '';
    //issuerNuis
    iicInput +=  parsedRequest.documentElement.getAttribute('NUIS');
    //dateTimeCreated
    iicInput += "|" + parsedRequest.documentElement.getAttribute('IssueDateTime');
    //invoiceNumber
    iicInput += "|" + parsedRequest.documentElement.getAttribute('WTNOrdNum');
    //busiUnitCode
    iicInput += "|" + parsedRequest.documentElement.getAttribute('BusinUnitCode');
    //softCode
    iicInput += "|" + parsedRequest.documentElement.getAttribute('SoftCode');    
    const { iscHash, iscSignature } = calculateISC(getPrivateCertificate(appArea), iicInput);
       return {       
        wtnic: iscHash,
        wtnicSignature: iscSignature
    }
}

export function processResponseByRequestType(appArea: string, requestType: string, transformedRequestXml: string, response: string, isSuccessReponse: boolean): any {
    const parsedResponse = new DOMParser().parseFromString(response, 'text/xml');
    let transformedResponse = null;
    if (parsedResponse) {

        switch (requestType) {
            case 'RegisterTCRRequest': transformedResponse = handleRegisterTCRResponse(appArea, transformedRequestXml, parsedResponse, isSuccessReponse); break;
            case 'RegisterCashDepositRequest': transformedResponse = handleRegisterCashDepositResponse(appArea, transformedRequestXml, parsedResponse, isSuccessReponse); break;
            case 'RegisterInvoiceRequest': transformedResponse = handleRegisterInvoiceResponse(appArea, transformedRequestXml, parsedResponse, isSuccessReponse); break;
            case 'RegisterWTNRequest': transformedResponse = handleRegisterWTNResponse(appArea, transformedRequestXml, parsedResponse, isSuccessReponse); break;
            case 'DmsCalculateIIC': transformedResponse = handleDmsCalculateIICResponse(appArea, transformedRequestXml, parsedResponse, isSuccessReponse); break;
            case 'DmsCalculateWTNIC': transformedResponse = handleDmsCalculateWTNICResponse(appArea, transformedRequestXml, parsedResponse, isSuccessReponse); break;
            default: throw new Error('Unkown request type');
        }

        if (transformedResponse) {
            
            transformedResponse.rawResponse = response;
            return transformedResponse;
        }
    }
    else {
        //response is not XML
        throw new Error(response)
    }
}