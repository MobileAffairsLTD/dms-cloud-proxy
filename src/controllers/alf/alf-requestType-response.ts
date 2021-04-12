
const DOMParser = require('xmldom').DOMParser;


function handleRegisterTCR(parser: Document): Record<string, any> {
    const RegisterTCRResponse = parser.documentElement.getElementsByTagName('RegisterTCRResponse');
    if (!RegisterTCRResponse || RegisterTCRResponse.length != 1) {
        throw new Error('Invalid response for RegisterTCRRequest');
    }
    const Header = parser.documentElement.getElementsByTagName('Header');
    const TCRCode = parser.documentElement.getElementsByTagName('TCRCode');
    return {
        tcrCode: TCRCode && TCRCode.length > 0 ? TCRCode[0].textContent : '',
        requestUUID: Header && Header.length > 0 ? Header[0].getAttribute('RequestUUID') : '',
    }
}

function handleRegisterCashDeposit(parser: Document): Record<string, any> {
    const RegisterCashDepositResponse = parser.documentElement.getElementsByTagName('RegisterCashDepositResponse');
    if (!RegisterCashDepositResponse || RegisterCashDepositResponse.length != 1) {
        throw new Error('Invalid response for RegisterCashDepositResponse');
    }
    const Header = parser.documentElement.getElementsByTagName('Header');
    const FCDC = parser.documentElement.getElementsByTagName('FCDC'); 
    return {
        fcdc: FCDC && FCDC.length>0?FCDC[0].textContent:null,
        requestUUID: Header && Header.length > 0 ? Header[0].getAttribute('RequestUUID') : '',
    }
}

function handleRegisterInvoice(parser: Document): Record<string, any> {
    const RegisterInvoiceResponse = parser.documentElement.getElementsByTagName('RegisterInvoiceResponse');
    if (!RegisterInvoiceResponse || RegisterInvoiceResponse.length != 1) {
        throw new Error('Invalid response for RegisterInvoiceResponse');
    }
    const Header = parser.documentElement.getElementsByTagName('Header');
    return {
        requestUUID: Header && Header.length > 0 ? Header[0].getAttribute('RequestUUID') : '',
    }
}

export function processResponseByRequestType(requestType: string, response: string): any {
    const parser = new DOMParser().parseFromString(response, 'text/xml');
    let transformedTesponse = null;
    if (parser) {

        switch (requestType) {
            case 'RegisterTCRRequest': transformedTesponse = handleRegisterTCR(parser); break;
            case 'RegisterCashDepositRequest': transformedTesponse = handleRegisterCashDeposit(parser); break;
            case 'RegisterInvoiceRequest': transformedTesponse = handleRegisterInvoice(parser); break;
            default: throw new Error('Unkown request type');
        }

        if (transformedTesponse) {
            transformedTesponse.rawResponse = response;
            return transformedTesponse;
        }
    }
    else {
        //response is not XML
        throw new Error(response)
    }
}