import { getPrivateCertificate } from "./alf-certificate-storage";
import { calculateISC, computeEinvoiceSignature, computeSignedRequest } from "./alf-requestSignature";
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
   
    if (!parsedRequest.documentElement.getAttribute('SoftCode')) {
        errors.push('Attribute SoftCode is required');
    }
    if (!parsedRequest.documentElement.getAttribute('TotPrice')) {
        errors.push('Attribute TotPrice is required');
    }
    if (errors.length > 0) {
        throw new Error(errors.join(';'));
    }
    return parser.documentElement.toString();
}

function handleRegisterDmsCalculateWTNICRequest(appArea: string, parser: Document): string {
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


async function handleRegisterRawEInvoiceRequest(appArea: string, parser: Document): Promise<string> {
    const terminatingString = '#AAI#';
    const defaultCurrency = 'ALL';
    const Invoice = parser.documentElement.getElementsByTagName('ns8:Invoice');
    if (!Invoice || Invoice.length != 1) {
        throw new Error('Invalid RegisterEInvoiceRequest: Invoice element is missing');
    }

    const invoiceDom = new DOMParser().parseFromString(Invoice.toString(), 'text/xml');
     
    const Header = parser.documentElement.getElementsByTagName('Header');
    if (!Header || Header.length != 1) {
        throw new Error('Invalid RegisterEInvoiceRequest: Header element is missing');
    }


    if(parser.documentElement.childNodes.length<2){
        throw new Error('Invalid RegisterEInvoiceRequest: Header and Invoice elements are requird');
    }

     
   
    let custId =  invoiceDom.documentElement.getElementsByTagName('CustomizationID');
    if(custId.length>0){
        custId = custId[0]
    }
    else 
        custId = undefined;
    

    const UBLExtensions = appendEmptyXmlElement( invoiceDom.documentElement, 'ns2:UBLExtensions', custId);
    const UBLExtension = appendEmptyXmlElement(UBLExtensions, 'ns2:UBLExtension');
    const ExtensionContent = appendEmptyXmlElement(UBLExtension, 'ns2:ExtensionContent');
    const UBLDocumentSignatures = appendEmptyXmlElement(ExtensionContent, 'ns7:UBLDocumentSignatures');
    const SignatureInformation = appendEmptyXmlElement(UBLDocumentSignatures, 'ns6:SignatureInformation');



    //actual signature generation , e.g. do not change invoice xml after that point
    //let cleanInvoiceXml = dom.documentElement.toLocaleString();
    let pureSignature = computeEinvoiceSignature('Invoice', invoiceDom.toString(), appArea);
   
    const signatureElement = new DOMParser().parseFromString(pureSignature, 'text/xml');
    SignatureInformation.appendChild(signatureElement.documentElement);


    let finalEInvoiceXml = invoiceDom.documentElement.toString();
    const buff = Buffer.from(finalEInvoiceXml);
    const invoiceAsBase64 = buff.toString('base64');
    const request = `<RegisterEinvoiceRequest xmlns="https://Einvoice.tatime.gov.al/EinvoiceService/schema" xmlns:ns2="http://www.w3.org/2000/09/xmldsig#" Id="Request" Version="1">${Header[0].toString()}<EinvoiceEnvelope><UblInvoice>${invoiceAsBase64}</UblInvoice></EinvoiceEnvelope></RegisterEinvoiceRequest>`;

    return request  
}

export async function processByRequestType(appArea: string, requestType: string, xml: string): Promise<{ transformedRequest: string; skipUplinkRequest: boolean }> {
    const parser = new DOMParser().parseFromString(xml, 'text/xml');
    if (parser) {

        switch (requestType.toUpperCase()) {
            case 'RegisterTCRRequest'.toUpperCase(): return { transformedRequest: xml, skipUplinkRequest: false };
            case 'RegisterCashDepositRequest'.toUpperCase(): return { transformedRequest: xml, skipUplinkRequest: false };
            case 'RegisterInvoiceRequest'.toUpperCase(): return { transformedRequest: handleRegisterInvoiceRequest(appArea, parser), skipUplinkRequest: false };
            case 'RegisterWTNRequest'.toUpperCase(): return { transformedRequest: handleRegisterWTNRequest(appArea, parser), skipUplinkRequest: false };
            case 'DmsCalculateIIC'.toUpperCase(): return { transformedRequest: handleRegisterDmsCalculateIICRequest(appArea, parser), skipUplinkRequest: true };
            case 'DmsCalculateWTNIC'.toUpperCase(): return { transformedRequest: handleRegisterDmsCalculateWTNICRequest(appArea, parser), skipUplinkRequest: true };
            case 'RegisterEInvoiceRequest'.toUpperCase(): return { transformedRequest: await handleRegisterRawEInvoiceRequest(appArea, parser), skipUplinkRequest: false };
            case 'GetTaxpayersRequest'.toUpperCase(): return { transformedRequest: xml, skipUplinkRequest: false };
            case 'GetEInvoicesRequest'.toUpperCase(): return { transformedRequest: xml, skipUplinkRequest: false };
            case 'EinvoiceChangeStatusRequest'.toUpperCase(): return { transformedRequest: xml, skipUplinkRequest: false };
            default: throw new Error('Unkown request type');
        }
    }
    else {
        //response is not XML
        throw new Error('Invalid request xml!')
    }
}


function appendEmptyXmlElement(cleanInvoiceXmlDom: any, elementName: string, beforeElement?: string): any {
    const newElement = cleanInvoiceXmlDom.ownerDocument.createElement(elementName);

    if (beforeElement) {
        cleanInvoiceXmlDom.insertBefore(newElement, beforeElement);
    }
    else {
        cleanInvoiceXmlDom.appendChild(newElement);
    }
    return newElement;

}
