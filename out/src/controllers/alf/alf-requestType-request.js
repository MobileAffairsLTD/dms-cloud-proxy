"use strict";
exports.__esModule = true;
exports.processByRequestType = void 0;
var alf_certificate_storage_1 = require("./alf-certificate-storage");
var alf_requestSignature_1 = require("./alf-requestSignature");
var DOMParser = require('xmldom').DOMParser;
function handleRegisterInvoiceRequest(appArea, parser) {
    var Invoice = parser.documentElement.getElementsByTagName('Invoice');
    if (!Invoice || Invoice.length != 1) {
        throw new Error('Invalid RegisterInvoiceRequest: Invoice element is missing');
    }
    var Seller = parser.documentElement.getElementsByTagName('Seller');
    if (!Seller || Seller.length != 1) {
        throw new Error('Invalid RegisterInvoiceRequest: Seller element is missing');
    }
    var issuerNuis = Seller[0].getAttribute('IDNum');
    var iicInput = '';
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
    var _a = alf_requestSignature_1.calculateISC(alf_certificate_storage_1.getPrivateCertificate(appArea), iicInput), iscHash = _a.iscHash, iscSignature = _a.iscSignature;
    parser.getElementsByTagName('Invoice')[0].setAttribute('IIC', iscHash);
    parser.getElementsByTagName('Invoice')[0].setAttribute('IICSignature', iscSignature);
    return parser.documentElement.toLocaleString();
}
function handleRegisterWTNRequest(appArea, parser) {
    var WTN = parser.documentElement.getElementsByTagName('WTN');
    if (!WTN || WTN.length != 1) {
        throw new Error('Invalid RegisterWTNRequest: WTN element is missing');
    }
    var Issuer = parser.documentElement.getElementsByTagName('Issuer');
    if (!Issuer || Issuer.length != 1) {
        throw new Error('Invalid RegisterWTNRequest: Issuer element is missing');
    }
    var issuerNuis = Issuer[0].getAttribute('NUIS');
    var iicInput = '';
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
    var _a = alf_requestSignature_1.calculateISC(alf_certificate_storage_1.getPrivateCertificate(appArea), iicInput), iscHash = _a.iscHash, iscSignature = _a.iscSignature;
    parser.getElementsByTagName('WTN')[0].setAttribute('WTNIC', iscHash);
    parser.getElementsByTagName('WTN')[0].setAttribute('WTNICSignature', iscSignature);
    return parser.documentElement.toLocaleString();
}
function handleRegisterDmsCalculateIICRequest(appArea, parser) {
    var parsedRequest = parser;
    //issuerNuis
    var errors = [];
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
    if (!parsedRequest.documentElement.getAttribute('TCRCode')) {
        errors.push('Attribute TCRCode is required');
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
function handleRegisterDmsCalculateWTNICRequest(appArea, parser) {
    var parsedRequest = parser;
    //issuerNuis
    var errors = [];
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
function handleRegisterEInvoiceRequest(appArea, parser) {
    var terminatingString = '#AAI#';
    var defaultCurrency = 'ALL';
    // const Invoice = parser.documentElement.getElementsByTagName('Invoice');
    // if (!Invoice || Invoice.length != 1) {
    //     throw new Error('Invalid RegisterEInvoiceRequest: Invoice element is missing');
    // }
    // const SameTax = parser.documentElement.getElementsByTagName('SameTax');
    // if (!SameTax || SameTax.length != 1) {
    //     throw new Error('Invalid RegisterEInvoiceRequest: SameTax element is missing');
    // }
    // const Seller = parser.documentElement.getElementsByTagName('Seller');
    // if (!Seller || Seller.length != 1) {
    //     throw new Error('Invalid RegisterEInvoiceRequest: Seller element is missing');
    // }
    // const Buyer = parser.documentElement.getElementsByTagName('Buyer');
    // if (!Buyer || Buyer.length != 1) {
    //     throw new Error('Invalid RegisterEInvoiceRequest: Buyer element is missing');
    // }
    // let FinalIic;
    // let finalIicSignature;
    // let fic = Invoice[0].getAttribute('FIC');
    // if(!fic){
    //     throw new Error('Invalid RegisterEInvoiceRequest: Invoice.FIC attribute is missing');
    // }
    // if(Invoice[0].getAttribute('IIC') && Invoice[0].getAttribute('IICSignature')){
    //     FinalIic = Invoice[0].getAttribute('IIC');
    //     finalIicSignature = Invoice[0].getAttribute('IICSignature');
    // }
    // else {
    //     const {iic, iicSignature } = handleDmsCalculateIICResponse(appArea, Invoice.toString() );
    //     FinalIic = iic;
    //     finalIicSignature = iicSignature;
    // }
    // const ubl = new ublInvoice(Invoice[0].getAttribute('InvNum'), {
    //     software: {
    //         id: Invoice[0].getAttribute('InvNum'),
    //         pin: undefined,
    //         providerNit: undefined,
    //     },
    //     issuer: {
    //         endDate: undefined,
    //         prefix: undefined,
    //         resolutionNumber: undefined,
    //         startDate: undefined,
    //         endRange: undefined,
    //         startRange: undefined,
    //         technicalKey: undefined
    //     },
    //     timestamp: (new Date().getTime()),
    //     enviroment: undefined
    // });
    // ubl.setDefaultProperties();
    // // ubl.addProperty('xmlns:ns8','urn:oasis:names:specification:ubl:schema:xsd:Invoice-2');
    // // ubl.addProperty('xmlns','urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2');
    // // ubl.addProperty('xmlns:ns2','urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2');
    // // ubl.addProperty('xmlns:ns3','urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2');
    // // ubl.addProperty('xmlns:ns4','urn:oasis:names:specification:ubl:schema:xsd:SignatureBasicComponents-2');
    // // ubl.addProperty('xmlns:ns5','http://www.w3.org/2000/09/xmldsig#');
    // ubl.addProperty('xmlns:sac','urn:oasis:names:specification:ubl:schema:xsd:SignatureAggregateComponents-2');
    // ubl.addProperty('xmlns:sig','urn:oasis:names:specification:ubl:schema:xsd:CommonSignatureComponents-2');
    // const issueDateTime = Invoice[0].getAttribute('IssueDateTime');
    // ubl.setIssueTime(issueDateTime.split('T')[1]);
    // ubl.setCustomizationID('urn:cen.eu:en16931:2017#compliant#urn:akshi.al:2019:1.0');
    // ubl.setDueDate(issueDateTime.split('T')[0]);
    // ubl.setProfileID('P1');
    // ubl.setInvoiceTypeCode('380');
    // ubl.setDocumentCurrencyCode(defaultCurrency);
    // ubl.setTaxCurrencyCode(defaultCurrency);
    // ubl.setDocumentCurrencyCode(defaultCurrency);
    // ubl.addNote(`IIC=${FinalIic}${terminatingString}`);
    // ubl.addNote(`IICSignature=${finalIicSignature}${terminatingString}`);
    // ubl.addNote(`FIC=${fic}${terminatingString}`);
    // ubl.addNote(`IssueDateTime=${issueDateTime}${terminatingString}`);
    // ubl.addNote(`OperatorCode=${Invoice[0].getAttribute('OperatorCode')}${terminatingString}`);
    // ubl.addNote(`BusinessUnitCode=${Invoice[0].getAttribute('BusinUnitCode')}${terminatingString}`);
    // ubl.addNote(`SoftwareCode=${Invoice[0].getAttribute('SoftCode')}${terminatingString}`);
    // ubl.addNote(`IsBadDebtInv=${'false'}${terminatingString}`);
    // const party = new Party({
    //     EndpointID: Seller[0].getAttribute('IDNum'),
    //     contact: undefined,
    //     industryClassificationCode: undefined,
    //     language: undefined,
    //     logoReferenceID: undefined,
    //     markAttentionIndicator: undefined,
    //     markCareIndicator: undefined,
    //     partyIdentifications: undefined,
    //     partyLegalEntities: undefined,
    //     partyNames: [new PartyName({ name: Seller[0].getAttribute('Name') })],
    //     partyTaxSchemes: undefined,
    //     websiteURI: undefined,
    // });
    // // const locationTypeCode = new PhysicalLocation({
    // //     address: Seller[0].getAttribute('Address'),
    // //     conditions: undefined,
    // //     countrySubentity: Seller[0].getAttribute('Country'),
    // //     countrySubentityCode: Seller[0].getAttribute('Country'),
    // //     description: Seller[0].getAttribute('Town'),
    // //     id: "4",
    // //     informationURI: "3",
    // //     locationTypeCode: "2",
    // //     name: "1",
    // //     validityPeriod: undefined,
    // // });
    // // locationTypeCode.classRefName="address";
    // // party.setPhysicalLocation(locationTypeCode)
    // ubl.setAccountingSupplierParty(new AccountingSupplierParty({
    //     additionalAccountIDs: undefined,
    //     customerAssignedAccountID: undefined,
    //     dataSendingCapability: undefined,
    //     party: party
    // }))
    // // ubl.setAccountingCustomerParty()
    // const paymentMeans = new PaymentMeans({
    //     id: undefined,
    //     paymentMeansCode: '54',
    //     paymentDueDate: undefined,
    //     paymentChannelCode: undefined,
    //     instructionID: undefined,
    //     instructionNotes: undefined,
    //     paymentID: undefined,
    // });
    // ubl.addPaymentMeans(paymentMeans)
    // //taxes
    // const tax = new TaxTotal({
    //     roundingAmount: undefined,
    //     taxAmount: new UdtAmount(Invoice[0].getAttribute('TotVATAmt'), { currencyID: defaultCurrency }),
    //     taxEvidenceIndicator: undefined,
    //     taxSubtotals: [
    //         new TaxSubtotal({
    //             taxAmount: new UdtAmount(Invoice[0].getAttribute('TotVATAmt'), { currencyID: defaultCurrency }),
    //             taxableAmount: new UdtAmount(Invoice[0].getAttribute('TotPriceWoVAT'), { currencyID: defaultCurrency }),
    //             baseUnitMeasure: undefined,
    //             calculationSequenceNumeric: undefined,
    //             perUnitAmount: undefined,
    //             percent: SameTax[0].getAttribute('VATRate'),
    //             taxCategory: new TaxCategory(
    //                 {
    //                     id: 'O',
    //                     taxExemptionReasonCode: 'vatex-eu-o',
    //                     taxScheme: new TaxScheme({
    //                         id: 'VAT',
    //                         currencyCode: undefined,
    //                         jurisdictionRegionAddress: undefined,
    //                         name: undefined,
    //                         taxTypeCode: undefined
    //                     }),
    //                     baseUnitMeasure: undefined,
    //                     name: undefined,
    //                     perUnitAmount: undefined,
    //                     percent: undefined,
    //                     taxExemptionReason: undefined,
    //                     tierRange: undefined,
    //                     tierRatePercent: undefined
    //                 }
    //             ),
    //             tierRange: undefined,
    //             tierRatePercent: undefined,
    //             transactionCurrencyTaxAmount: undefined,
    //         })
    //     ]
    // });
    // ubl.addTaxTotal(tax);
    // const monetaryTotal = new LegalMonetaryTotal({
    //     allowanceTotalAmount: undefined,
    //     chargeTotalAmount: undefined,
    //     payableAlternativeAmount: undefined,
    //     payableRoundingAmount: undefined,
    //     prepaidAmount: undefined,
    //     payableAmount: new UdtAmount(Invoice[0].getAttribute('TotPrice'), { currencyID: defaultCurrency }),
    //     lineExtensionAmount: new UdtAmount(Invoice[0].getAttribute('TotPrice'), { currencyID: defaultCurrency }),
    //     taxExclusiveAmount: new UdtAmount(Invoice[0].getAttribute('TotPriceWoVAT'), { currencyID: defaultCurrency }),
    //     taxInclusiveAmount: new UdtAmount(Invoice[0].getAttribute('TotPrice'), { currencyID: defaultCurrency }),
    // });
    // //totals
    // ubl.setLegalMonetaryTotal(monetaryTotal);
    // //invoice lines
    // const Lines = parser.documentElement.getElementsByTagName('I');
    // if (!Lines || Lines.length != 1) {
    //     throw new Error('Invalid RegisterEInvoiceRequest: At one I element must be presented');
    // }
    // for(let i=0;i<Lines.length;i++){
    //     const lineElement = Lines[0];
    //     const item = new Item({
    //         name: lineElement.getAttribute('N'),
    //         catalogueIndicator: undefined,
    //         brandName: undefined,
    //         modelName: undefined,
    //         packQuantity: undefined,
    //         packSizeNumeric: undefined,
    //         descriptions: undefined,
    //         additionalInformations: undefined,
    //         hazardousRiskIndicator: undefined,
    //         keywords: undefined,
    //     });
    //     const price = new Price(undefined);
    //     price.setPriceAmount(new UdtAmount(lineElement.getAttribute('PA'), { currencyID: defaultCurrency }));
    //     price.setBaseQuantity('1');
    //     ubl.addInvoiceLine({
    //         id: i.toString(),
    //         uuid: undefined,
    //         notes: undefined,
    //         invoicedQuantity: lineElement.getAttribute('Q'),
    //         lineExtensionAmount: new UdtAmount(lineElement.getAttribute('PA'), { currencyID: defaultCurrency }),
    //         taxPointDate: undefined,
    //         accountingCostCode: undefined,
    //         accountingCost: undefined,
    //         paymentPurposeCode: undefined,
    //         freeOfChargeIndicator: 'false',
    //         invoicePeriods: undefined,
    //         orderLineReferences: undefined,
    //         despatchLineReference: undefined,
    //         receiptLineReference: undefined,
    //         billingReference: undefined,
    //         documentReference: undefined,
    //         originatorParty: undefined,
    //         delivery: undefined,
    //         paymentTerms: undefined,
    //         taxTotals: undefined,
    //         withholdingTaxTotal: undefined,
    //         item: item,
    //         price: price,
    //         deliveryTerms: undefined
    //     })
    // }
    // ubl.setAccountingCustomerParty({
    //     customerAssignedAccountID: Buyer[0].getAttribute('IDNum'),
    //     additionalAccountIDs: undefined,
    //     dataSendingCapability: undefined,
    //     party: new Party(
    //         {
    //             markCareIndicator: 'false',
    //             markAttentionIndicator: 'false',
    //             websiteURI: undefined,
    //             logoReferenceID: undefined,
    //             EndpointID: Buyer[0].getAttribute('IDNum'),
    //             industryClassificationCode: undefined,
    //             partyIdentifications: undefined,
    //             partyNames: [new PartyName({ name: Buyer[0].getAttribute('Name') })],
    //             language: undefined,
    //             partyTaxSchemes: undefined,
    //             partyLegalEntities: undefined,
    //             contact: undefined
    //         })
    //     // accountingContact: new AccountingContact({
    //     //     id: undefined,
    //     //     name: undefined,
    //     //     telephone: undefined,
    //     //     telefax: undefined,
    //     //     electronicMail: undefined,
    //     //     note: undefined,
    //     // })
    //     //buyerContact: undefined
    // })
    var invoiceTagName = "Invoice";
    // const Invoice = parser.documentElement.getElementsByTagName(invoiceTagName);
    // if (!Invoice || Invoice.length != 1) {
    //     throw new Error('Invalid RegisterEInvoiceRequest: Invoice element is missing');
    // }
    var Invoice = parser.documentElement.childNodes[0];
    Invoice.setAttribute('xmlns:sac', 'urn:oasis:names:specification:ubl:schema:xsd:SignatureAggregateComponents-2');
    Invoice.setAttribute('xmlns:sig', 'urn:oasis:names:specification:ubl:schema:xsd:CommonSignatureComponents-2');
    Invoice.setAttribute('xmlns:ext', 'urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2');
    Invoice.setAttribute('xmlns:ds', 'http://www.w3.org/2000/09/xmldsig#');
    // { key: 'xmlns:cac', value: 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2' },
    //         { key: 'xmlns:cbc', value: 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2' },
    //         { key: 'xmlns:ds', value: 'http://www.w3.org/2000/09/xmldsig#' },
    //         { key: 'xmlns:ext', value: 'urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2' },
    //         { key: 'xmlns:sts', value: 'http://www.dian.gov.co/contratos/facturaelectronica/v1/Structures' },
    //         // "dian:gov:co:facturaelectronica:Structures-2-1" ,
    //         { key: 'xmlns:xades', value: 'http://uri.etsi.org/01903/v1.3.2#' },
    //         { key: 'xmlns:xades141', value: 'http://uri.etsi.org/01903/v1.4.1#' },
    //         { key: 'xmlns:xsi', value: 'http://www.w3.org/2001/XMLSchema-instance' },
    //let cleanInvoiceXml = Invoice[0].toLocaleString(); //ubl.getXml();
    //cleanInvoiceXml = cleanInvoiceXml.replace('<?xml version="1.0" encoding="UTF-8" standalone="no"?>','');
    //const cleanInvoiceXmlDom = new DOMParser().parseFromString(cleanInvoiceXml, 'text/xml');
    //cleanInvoiceXmlDom.documentElement.removeChild(cleanInvoiceXmlDom.documentElement.getElementsByTagName('cbc:UBLVersionID')[0]);
    var cleanInvoiceXmlDom = new DOMParser().parseFromString(Invoice.toLocaleString(), 'text/xml');
    //actual signature generation , e.g. do not change invoice xml after that point
    var cleanInvoiceXml = cleanInvoiceXmlDom.documentElement.toLocaleString();
    var pureSignature = alf_requestSignature_1.computeEinvoiceSignature('Invoice', cleanInvoiceXml, appArea);
    var UBLExtensions = appendEmptyXmlElement(cleanInvoiceXmlDom.documentElement, 'ext:UBLExtensions', cleanInvoiceXmlDom.documentElement.getElementsByTagName('CustomizationID')[0]);
    var UBLExtension = appendEmptyXmlElement(UBLExtensions, 'ext:UBLExtension');
    var ExtensionContent = appendEmptyXmlElement(UBLExtension, 'ext:ExtensionContent');
    var UBLDocumentSignatures = appendEmptyXmlElement(ExtensionContent, 'sig:UBLDocumentSignatures');
    var SignatureInformation = appendEmptyXmlElement(UBLDocumentSignatures, 'sac:SignatureInformation');
    var signatureElement = new DOMParser().parseFromString(pureSignature, 'text/xml');
    SignatureInformation.appendChild(signatureElement);
    var finalEInvoiceXml = cleanInvoiceXmlDom.documentElement.toString();
    var buff = Buffer.from(finalEInvoiceXml);
    var invoiceAsBase64 = buff.toString('base64');
    var request = "<RegisterEinvoiceRequest xmlns=\"https://Einvoice.tatime.gov.al/EinvoiceService/schema\"\n    xmlns:ns2=\"http://www.w3.org/2000/09/xmldsig#\" Id=\"Request\" Version=\"1\"> <Header SendDateTime=\"2021-05-07T17:05:36+02:00\" UUID=\"af847648-5091-4a8c-a78a-9d98206a319c\"/><EinvoiceEnvelope><UblInvoice>" + invoiceAsBase64 + "</UblInvoice></EinvoiceEnvelope></RegisterEinvoiceRequest>";
    //const ublInv = parser.documentElement.getElementsByTagName('UblInvoice');
    //if (!ublInv || ublInv.length != 1) {
    //    throw new Error('Element UblInvoice is missing in the request!');
    //}
    //ublInv[0].textContent = buff.toString('base64');
    return request;
}
function processByRequestType(appArea, requestType, xml) {
    var parser = new DOMParser().parseFromString(xml, 'text/xml');
    if (parser) {
        switch (requestType.toUpperCase()) {
            case 'RegisterTCRRequest'.toUpperCase(): return { transformedRequest: xml, skipUplinkRequest: false };
            case 'RegisterCashDepositRequest'.toUpperCase(): return { transformedRequest: xml, skipUplinkRequest: false };
            case 'RegisterInvoiceRequest'.toUpperCase(): return { transformedRequest: handleRegisterInvoiceRequest(appArea, parser), skipUplinkRequest: false };
            case 'RegisterWTNRequest'.toUpperCase(): return { transformedRequest: handleRegisterWTNRequest(appArea, parser), skipUplinkRequest: false };
            case 'DmsCalculateIIC'.toUpperCase(): return { transformedRequest: handleRegisterDmsCalculateIICRequest(appArea, parser), skipUplinkRequest: true };
            case 'DmsCalculateWTNIC'.toUpperCase(): return { transformedRequest: handleRegisterDmsCalculateWTNICRequest(appArea, parser), skipUplinkRequest: true };
            case 'RegisterEInvoiceRequest'.toUpperCase(): return { transformedRequest: handleRegisterEInvoiceRequest(appArea, parser), skipUplinkRequest: false };
            case 'GetTaxpayersRequest'.toUpperCase(): return { transformedRequest: xml, skipUplinkRequest: false };
            case 'GetEInvoicesRequest'.toUpperCase(): return { transformedRequest: xml, skipUplinkRequest: false };
            default: throw new Error('Unkown request type');
        }
    }
    else {
        //response is not XML
        throw new Error('Invalid request xml!');
    }
}
exports.processByRequestType = processByRequestType;
function appendEmptyXmlElement(cleanInvoiceXmlDom, elementName, beforeElement) {
    var newElement = cleanInvoiceXmlDom.ownerDocument.createElement(elementName);
    if (beforeElement) {
        cleanInvoiceXmlDom.insertBefore(newElement, beforeElement);
    }
    else {
        cleanInvoiceXmlDom.appendChild(newElement);
    }
    return newElement;
}
//# sourceMappingURL=alf-requestType-request.js.map