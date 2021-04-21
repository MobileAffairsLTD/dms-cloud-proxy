import { getPrivateCertificate } from "./alf-certificate-storage";
import { calculateISC } from "./alf-requestSignature";

const DOMParser = require('xmldom').DOMParser;
type Document = any;

function handleRegisterInvoiceRequest(appArea: string, parser: Document): string {
    const Invoice = parser.documentElement.getElementsByTagName('Invoice');
    if (!Invoice || Invoice.length != 1) {
        throw new Error('Invalid RegisterInvoiceRequest: Invoice element is missing');
    }

    
    const Seller = parser.documentElement.getElementsByTagName('Seller');
    if (!Seller || Seller.length != 1) {
        throw new Error('Invalid RegisterInvoiceRequest: Seller element is missing');
    }

    

    const issuerNuis = Seller[0].getAttribute('IDNum');
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
    const { iscHash, iscSignature } = calculateISC(getPrivateCertificate(appArea), iicInput);
    parser.getElementsByTagName('Invoice')[0].setAttribute('IIC', iscHash);
    parser.getElementsByTagName('Invoice')[0].setAttribute('IICSignature', iscSignature);
    return parser.documentElement.toLocaleString();
}


function handleRegisterWTNRequest(appArea: string, parser: Document): string {
    const WTN = parser.documentElement.getElementsByTagName('WTN');
    if (!WTN || WTN.length != 1) {
        throw new Error('Invalid RegisterWTNRequest: WTN element is missing');
    }


    const Issuer = parser.documentElement.getElementsByTagName('Issuer');
    if (!Issuer || Issuer.length != 1) {
        throw new Error('Invalid RegisterWTNRequest: Issuer element is missing');
    }


    const issuerNuis = Issuer[0].getAttribute('NUIS');

    let iicInput = '';
    //issuerNuis
    iicInput += issuerNuis;
    //dateTimeCreated
    iicInput += "|" + WTN[0].getAttribute('IssueDateTime');
    //invoiceNumber
    iicInput += "|" + WTN[0].getAttribute('WTNOrdNum');
    //busiUnitCode
    iicInput += "|" + WTN[0].getAttribute('BusinUnitCode');    
    //softCode
    iicInput += "|" + WTN[0].getAttribute('SoftCode');
    const { iscHash, iscSignature } = calculateISC(getPrivateCertificate(appArea), iicInput);
    parser.getElementsByTagName('WTN')[0].setAttribute('WTNIC', iscHash);
    parser.getElementsByTagName('WTN')[0].setAttribute('WTNICSignature', iscSignature);
    return parser.documentElement.toLocaleString();
}


function handleRegisterDmsCalculateIICRequest(appArea: string, parser: Document): string {
    const parsedRequest = parser;
    //issuerNuis
    const errors = [];
    if(!parsedRequest.documentElement.getAttribute('IssuerNuis')){
        errors.push('Attribute IssuerNuis is required');
    }
    if(!parsedRequest.documentElement.getAttribute('IssueDateTime')){
        errors.push('Attribute IssueDateTime is required');
    }
    if(!parsedRequest.documentElement.getAttribute('InvOrdNum')){
        errors.push('Attribute InvOrdNum is required');
    }
    if(!parsedRequest.documentElement.getAttribute('BusinUnitCode')){
        errors.push('Attribute BusinUnitCode is required');
    }
    if(!parsedRequest.documentElement.getAttribute('TCRCode')){
        errors.push('Attribute TCRCode is required');
    }
    if(!parsedRequest.documentElement.getAttribute('SoftCode')){
        errors.push('Attribute SoftCode is required');
    }
    if(!parsedRequest.documentElement.getAttribute('TotPrice')){
        errors.push('Attribute TotPrice is required');
    }
    if(errors.length>0){
        throw new Error(errors.join(';'));
    }    
    return "<response></response>";
}

function handleRegisterDmsCalculateWTNICRequest(appArea: string, parser: Document): string {
    const parsedRequest = parser;
    //issuerNuis
    const errors = [];
    if(!parsedRequest.documentElement.getAttribute('IssuerNuis')){
        errors.push('Attribute IssuerNuis is required');
    }
    if(!parsedRequest.documentElement.getAttribute('IssueDateTime')){
        errors.push('Attribute IssueDateTime is required');
    }
    if(!parsedRequest.documentElement.getAttribute('WTNOrdNum')){
        errors.push('Attribute WTNOrdNum is required');
    }
    if(!parsedRequest.documentElement.getAttribute('BusinUnitCode')){
        errors.push('Attribute BusinUnitCode is required');
    }  
    if(!parsedRequest.documentElement.getAttribute('SoftCode')){
        errors.push('Attribute SoftCode is required');
    }
    if(errors.length>0){
        throw new Error(errors.join(';'));
    }    
    return "<response></response>";
}


function handleRegisterEInvoiceRequest(appArea: string, parser: Document): string {
    // const Invoice = parser.documentElement.getElementsByTagName('Invoice');
    // if (!Invoice || Invoice.length != 1) {
    //     throw new Error('Invalid RegisterEInvoiceRequest: Invoice element is missing');
    // }

    
    // const Seller = parser.documentElement.getElementsByTagName('Seller');
    // if (!Seller || Seller.length != 1) {
    //     throw new Error('Invalid RegisterInvoiceRequest: Seller element is missing');
    // }

    

    // const issuerNuis = Seller[0].getAttribute('IDNum');
    // let iicInput = '';
    // //issuerNuis
    // iicInput += issuerNuis;
    // //dateTimeCreated
    // iicInput += "|" + Invoice[0].getAttribute('IssueDateTime');
    // //invoiceNumber
    // iicInput += "|" + Invoice[0].getAttribute('InvOrdNum');
    // //busiUnitCode
    // iicInput += "|" + Invoice[0].getAttribute('BusinUnitCode');
    // //tcrCode
    // iicInput += "|" + Invoice[0].getAttribute('TCRCode');
    // //softCode
    // iicInput += "|" + Invoice[0].getAttribute('SoftCode');
    // //totalPrice
    // iicInput += "|" + Invoice[0].getAttribute('TotPrice');
    // const { iscHash, iscSignature } = calculateISC(getPrivateCertificate(appArea), iicInput);
    // parser.getElementsByTagName('Invoice')[0].setAttribute('IIC', iscHash);
    // parser.getElementsByTagName('Invoice')[0].setAttribute('IICSignature', iscSignature);
      return parser.documentElement.toLocaleString();
}

export function processByRequestType(appArea: string, requestType: string, xml: string): {transformedRequest: string; skipUplinkRequest: boolean} {
    const parser = new DOMParser().parseFromString(xml, 'text/xml');
    if (parser) {

        switch (requestType.toUpperCase()) {
            case 'RegisterTCRRequest'.toUpperCase(): return {transformedRequest:xml, skipUplinkRequest: false};
            case 'RegisterCashDepositRequest'.toUpperCase(): return {transformedRequest:xml, skipUplinkRequest: false};
            case 'RegisterInvoiceRequest'.toUpperCase(): return {transformedRequest: handleRegisterInvoiceRequest(appArea, parser), skipUplinkRequest: false };
            case 'RegisterWTNRequest'.toUpperCase(): return {transformedRequest: handleRegisterWTNRequest(appArea, parser), skipUplinkRequest: false };
            case 'DmsCalculateIIC'.toUpperCase(): return { transformedRequest:handleRegisterDmsCalculateIICRequest(appArea, parser) , skipUplinkRequest: true};
            case 'DmsCalculateWTNIC'.toUpperCase(): return { transformedRequest:handleRegisterDmsCalculateWTNICRequest(appArea, parser) , skipUplinkRequest: true};
            case 'RegisterEInvoiceRequest'.toUpperCase(): return {transformedRequest: handleRegisterEInvoiceRequest(appArea, parser), skipUplinkRequest: false };
            
            default: throw new Error('Unkown request type');
        }
    }
    else {
        //response is not XML
        throw new Error('Invalid request xml!')
    }
}