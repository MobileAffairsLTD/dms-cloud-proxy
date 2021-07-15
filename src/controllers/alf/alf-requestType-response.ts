import { getLocalPrivateCertificate } from "./alf-certificate-storage";
import { calculateISC } from "./alf-requestSignature";

const DOMParser = require('xmldom').DOMParser;

type Document = any;

function handleRegisterTCRResponse(appArea: string, requestXml: string, parsedResponse: Document, isSuccessReponse: boolean): Record<string, any> {
    const RegisterTCRResponse = parsedResponse.documentElement.getElementsByTagName('RegisterTCRResponse');
    if (!isSuccessReponse) {
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
    if (!isSuccessReponse) {
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
        iicSignature: parsedRequest.documentElement.getElementsByTagName('Invoice')[0].getAttribute('IICSignature'),
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
    const FWTNIC = parsedResponse.documentElement.getElementsByTagName('FWTNIC');

    if (!FWTNIC || FWTNIC.length == 0) {
        throw 'FWTNIC was not returned'
    }

    return {
        fwtnic: FWTNIC && FWTNIC.length > 0 ? FWTNIC[0].textContent : '',
        wtnic: parsedRequest.documentElement.getElementsByTagName('WTN')[0].getAttribute('WTNIC'),
        requestUUID: Header && Header.length > 0 ? Header[0].getAttribute('RequestUUID') : '',
    }
}


export function handleDmsCalculateIICResponse(apiKey: string, appArea: string, requestXml: string): Record<string, any> {
    const parsedRequest = new DOMParser().parseFromString(requestXml, 'text/xml');

    let nuis = parsedRequest.documentElement.getAttribute('NUIS');
    if (!nuis) {
        nuis = parsedRequest.documentElement.getAttribute('IssuerNuis');
    }
    if (!nuis) {
        nuis = parsedRequest.documentElement.getAttribute('IssuerNuis');
    }

    if (!nuis) {
        const seller = parsedRequest.documentElement.getElementsByTagName('Seller');
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
    if (!parsedRequest.documentElement.getAttribute('SoftCode')) {
        throw new Error('IIC calculation erorr: Invoice.SoftCode attribute is required');
    }
    if (!parsedRequest.documentElement.getAttribute('TotPrice')) {
        throw new Error('IIC calculation erorr: Invoice.TotPrice attribute is required');
    }


    let iicInput = '';
    //issuerNuis
    iicInput += nuis;//'L01714012M';
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
    const { iscHash, iscSignature } = calculateISC(getLocalPrivateCertificate(appArea), iicInput);
    return {
        iic: iscHash,
        iicSignature: iscSignature
    }
}

async function handleDmsCalculateWTNICResponse(apiKey: string, appArea: string, requestXml: string, parsedResponse: Document, isSuccessReponse: boolean): Promise<Record<string, any>> {
    const parsedRequest = new DOMParser().parseFromString(requestXml, 'text/xml');
    let iicInput = '';
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
    const { iscHash, iscSignature } = calculateISC(getLocalPrivateCertificate(appArea), iicInput);
    return {
        wtnic: iscHash,
        wtnicSignature: iscSignature,
    }
}



function handleGetTaxPayersResponse(appArea: string, requestXml: string, parsedResponse: Document, isSuccessReponse: boolean): Record<string, any> {
    const parsedRequest = new DOMParser().parseFromString(requestXml, 'text/xml');

    const Taxpayer = parsedResponse.documentElement.getElementsByTagName('ns2:Taxpayer');
    const Header = parsedResponse.documentElement.getElementsByTagName('Header');
    const taxPayers = [];
    for (let i = -0; i < Taxpayer.length; i++) {
        const node = Taxpayer[i];
        taxPayers.push({
            name: node.getAttribute('Name'),
            tin: node.getAttribute('Tin'),
            town: node.getAttribute('Town'),
            country: node.getAttribute('Country'),
            address: node.getAttribute('Address')
        })
    }

    return {
        taxPayers: taxPayers,
        requestUUID: Header && Header.length > 0 ? Header[0].getAttribute('RequestUUID') : '',
    }
}

function handleRegisterEInvoiceResponse(appArea: string, requestXml: string, parsedResponse: Document, isSuccessReponse: boolean): Record<string, any> {
    const parsedRequest = new DOMParser().parseFromString(requestXml, 'text/xml');
    let fault = undefined;
    let code = undefined;
    try {
        console.log('RegisterEInvoiceResponse: ' + parsedResponse.documentElement.toString());
    }
    catch (error) {

    }
    let RegisterEInvoiceResponse = parsedResponse.documentElement.getElementsByTagName('ns2:RegisterEinvoiceResponse');
    if (!isSuccessReponse) {
        throw parsedResponse.documentElement.toString();
    }
    else {
        if (!RegisterEInvoiceResponse || RegisterEInvoiceResponse.length != 1) {
            RegisterEInvoiceResponse = parsedResponse.documentElement.getElementsByTagName('RegisterEinvoiceResponse');
        }

        if (!RegisterEInvoiceResponse || RegisterEInvoiceResponse.length != 1) {
            throw new Error('ERROR: Invalid response for RegisterEinvoiceRequest! ' + parsedResponse.documentElement.toString());
        }
    }
    let Header = parsedResponse.documentElement.getElementsByTagName('ns2:Header');
    if (!Header || Header.length != 1) {
        Header = parsedResponse.documentElement.getElementsByTagName('Header');
    }

    let eic = parsedResponse.documentElement.getElementsByTagName('ns2:EIC');
    if (!eic || eic.length != 1) {
        eic = parsedResponse.documentElement.getElementsByTagName('EIC');
    }
    return {
        eic: eic && eic.length > 0 ? eic[0].textContent : '',
        requestUUID: Header && Header.length > 0 ? Header[0].getAttribute('RequestUUID') : '',
    }
}

function handleGetEInvoicesResponse(appArea: string, requestXml: string, parsedResponse: Document, isSuccessReponse: boolean): Record<string, any> {
    const parsedRequest = new DOMParser().parseFromString(requestXml, 'text/xml');


    const Header = parsedResponse.documentElement.getElementsByTagName('Header');

    return {
        requestUUID: Header && Header.length > 0 ? Header[0].getAttribute('RequestUUID') : '',
    }
}

function handleEinvoiceChangeStatusResponse(appArea: string, requestXml: string, parsedResponse: Document, isSuccessReponse: boolean): Record<string, any> {
    const parsedRequest = new DOMParser().parseFromString(requestXml, 'text/xml');


    const Header = parsedResponse.documentElement.getElementsByTagName('Header');

    return {
        requestUUID: Header && Header.length > 0 ? Header[0].getAttribute('RequestUUID') : '',
    }
}

export function processResponseByRequestType(apiKey: string, appArea: string, requestType: string, transformedRequestXml: string, response: string, isSuccessReponse: boolean): any {
    const parsedResponse = new DOMParser().parseFromString(response, 'text/xml');
    let transformedResponse = null;
    if (parsedResponse) {

        switch (requestType.toUpperCase()) {
            case 'RegisterTCRRequest'.toUpperCase(): transformedResponse = handleRegisterTCRResponse(appArea, transformedRequestXml, parsedResponse, isSuccessReponse); break;
            case 'RegisterCashDepositRequest'.toUpperCase(): transformedResponse = handleRegisterCashDepositResponse(appArea, transformedRequestXml, parsedResponse, isSuccessReponse); break;
            case 'RegisterInvoiceRequest'.toUpperCase(): transformedResponse = handleRegisterInvoiceResponse(appArea, transformedRequestXml, parsedResponse, isSuccessReponse); break;
            case 'RegisterWTNRequest'.toUpperCase(): transformedResponse = handleRegisterWTNResponse(appArea, transformedRequestXml, parsedResponse, isSuccessReponse); break;
            case 'DmsCalculateIIC'.toUpperCase(): transformedResponse = handleDmsCalculateIICResponse(apiKey, appArea, transformedRequestXml); break;
            case 'DmsCalculateWTNIC'.toUpperCase(): transformedResponse = handleDmsCalculateWTNICResponse(apiKey, appArea, transformedRequestXml, parsedResponse, isSuccessReponse); break;
            case 'RegisterEInvoiceRequest'.toUpperCase(): transformedResponse = handleRegisterEInvoiceResponse(appArea, transformedRequestXml, parsedResponse, isSuccessReponse); break;
            case 'GetTaxpayersRequest'.toUpperCase(): transformedResponse = handleGetTaxPayersResponse(appArea, transformedRequestXml, parsedResponse, isSuccessReponse); break;
            case 'GetEInvoicesRequest'.toUpperCase(): transformedResponse = handleGetEInvoicesResponse(appArea, transformedRequestXml, parsedResponse, isSuccessReponse); break;
            case 'EinvoiceChangeStatusRequest'.toUpperCase(): transformedResponse = handleEinvoiceChangeStatusResponse(appArea, transformedRequestXml, parsedResponse, isSuccessReponse); break;
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