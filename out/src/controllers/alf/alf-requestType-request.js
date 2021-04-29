"use strict";
exports.__esModule = true;
exports.processByRequestType = void 0;
var alf_certificate_storage_1 = require("./alf-certificate-storage");
var alf_requestSignature_1 = require("./alf-requestSignature");
var ubl_builder_1 = require("ubl-builder");
var CommonAggregateComponents_1 = require("ubl-builder/lib/ubl21/CommonAggregateComponents");
var UnqualifiedDataTypes_1 = require("ubl-builder/lib/ubl21/types/UnqualifiedDataTypes");
var alf_requestType_response_1 = require("./alf-requestType-response");
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
    var defaultCurrency = 'ALL';
    var Invoice = parser.documentElement.getElementsByTagName('Invoice');
    if (!Invoice || Invoice.length != 1) {
        throw new Error('Invalid RegisterEInvoiceRequest: Invoice element is missing');
    }
    var SameTax = parser.documentElement.getElementsByTagName('SameTax');
    if (!SameTax || SameTax.length != 1) {
        throw new Error('Invalid RegisterEInvoiceRequest: SameTax element is missing');
    }
    var Seller = parser.documentElement.getElementsByTagName('Seller');
    if (!Seller || Seller.length != 1) {
        throw new Error('Invalid RegisterEInvoiceRequest: Seller element is missing');
    }
    var Buyer = parser.documentElement.getElementsByTagName('Buyer');
    if (!Buyer || Buyer.length != 1) {
        throw new Error('Invalid RegisterEInvoiceRequest: Buyer element is missing');
    }
    var _a = alf_requestType_response_1.handleDmsCalculateIICResponse(appArea, Invoice.toString()), iic = _a.iic, iicSignature = _a.iicSignature;
    var ubl = new ubl_builder_1.Invoice(Invoice[0].getAttribute('InvNum'), {
        software: {
            id: Invoice[0].getAttribute('InvNum'),
            pin: undefined,
            providerNit: undefined
        },
        issuer: {
            endDate: undefined,
            prefix: undefined,
            resolutionNumber: undefined,
            startDate: undefined,
            endRange: undefined,
            startRange: undefined,
            technicalKey: undefined
        },
        timestamp: (new Date().getTime()),
        enviroment: undefined
    });
    ubl.setDefaultProperties();
    // ubl.addProperty('xmlns:ns8','urn:oasis:names:specification:ubl:schema:xsd:Invoice-2');
    // ubl.addProperty('xmlns','urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2');
    // ubl.addProperty('xmlns:ns2','urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2');
    // ubl.addProperty('xmlns:ns3','urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2');
    // ubl.addProperty('xmlns:ns4','urn:oasis:names:specification:ubl:schema:xsd:SignatureBasicComponents-2');
    // ubl.addProperty('xmlns:ns5','http://www.w3.org/2000/09/xmldsig#');
    ubl.addProperty('xmlns:sig2', 'urn:oasis:names:specification:ubl:schema:xsd:SignatureAggregateComponents-2');
    ubl.addProperty('xmlns:sig1', 'urn:oasis:names:specification:ubl:schema:xsd:CommonSignatureComponents-2');
    var issueDateTime = Invoice[0].getAttribute('IssueDateTime');
    ubl.setIssueTime(issueDateTime.split('T')[1]);
    ubl.setCustomizationID('urn:cen.eu:en16931:2017');
    ubl.setDueDate(issueDateTime.split('T')[0]);
    ubl.setProfileID('P1');
    ubl.setInvoiceTypeCode('380');
    ubl.setDocumentCurrencyCode(defaultCurrency);
    ubl.setTaxCurrencyCode(defaultCurrency);
    ubl.setDocumentCurrencyCode(defaultCurrency);
    ubl.addNote("IIC=" + iic);
    ubl.addNote("IICSignature=" + iicSignature);
    ubl.addNote("FIC=" + 'fic1');
    ubl.addNote("IssueDateTime=" + issueDateTime);
    ubl.addNote("OperatorCode=" + Invoice[0].getAttribute('OperatorCode'));
    ubl.addNote("BusinessUnitCode=" + Invoice[0].getAttribute('BusinUnitCode'));
    ubl.addNote("SoftwareCode=" + Invoice[0].getAttribute('SoftCode'));
    ubl.addNote("IsBadDebtInv=" + 'false');
    var party = new CommonAggregateComponents_1.Party({
        EndpointID: Seller[0].getAttribute('IDNum'),
        contact: undefined,
        industryClassificationCode: undefined,
        language: undefined,
        logoReferenceID: undefined,
        markAttentionIndicator: undefined,
        markCareIndicator: undefined,
        partyIdentifications: undefined,
        partyLegalEntities: undefined,
        partyNames: [new CommonAggregateComponents_1.PartyName({ name: Seller[0].getAttribute('Name') })],
        partyTaxSchemes: undefined,
        websiteURI: undefined
    });
    // const locationTypeCode = new PhysicalLocation({
    //     address: Seller[0].getAttribute('Address'),
    //     conditions: undefined,
    //     countrySubentity: Seller[0].getAttribute('Country'),
    //     countrySubentityCode: Seller[0].getAttribute('Country'),
    //     description: Seller[0].getAttribute('Town'),
    //     id: "4",
    //     informationURI: "3",
    //     locationTypeCode: "2",
    //     name: "1",
    //     validityPeriod: undefined,
    // });
    // locationTypeCode.classRefName="address";
    // party.setPhysicalLocation(locationTypeCode)
    ubl.setAccountingSupplierParty(new CommonAggregateComponents_1.AccountingSupplierParty({
        additionalAccountIDs: undefined,
        customerAssignedAccountID: undefined,
        dataSendingCapability: undefined,
        party: party
    }));
    // ubl.setAccountingCustomerParty()
    var paymentMeans = new CommonAggregateComponents_1.PaymentMeans({
        id: undefined,
        paymentMeansCode: '54',
        paymentDueDate: undefined,
        paymentChannelCode: undefined,
        instructionID: undefined,
        instructionNotes: undefined,
        paymentID: undefined
    });
    ubl.addPaymentMeans(paymentMeans);
    //taxes
    var tax = new CommonAggregateComponents_1.TaxTotal({
        roundingAmount: undefined,
        taxAmount: new UnqualifiedDataTypes_1.UdtAmount(Invoice[0].getAttribute('TotVATAmt'), { currencyID: defaultCurrency }),
        taxEvidenceIndicator: undefined,
        taxSubtotals: [
            new CommonAggregateComponents_1.TaxSubtotal({
                taxAmount: new UnqualifiedDataTypes_1.UdtAmount(Invoice[0].getAttribute('TotVATAmt'), { currencyID: defaultCurrency }),
                taxableAmount: new UnqualifiedDataTypes_1.UdtAmount(Invoice[0].getAttribute('TotPriceWoVAT'), { currencyID: defaultCurrency }),
                baseUnitMeasure: undefined,
                calculationSequenceNumeric: undefined,
                perUnitAmount: undefined,
                percent: SameTax[0].getAttribute('VATRate'),
                taxCategory: new CommonAggregateComponents_1.TaxCategory({
                    id: 'O',
                    taxExemptionReasonCode: 'vatex-eu-o',
                    taxScheme: new CommonAggregateComponents_1.TaxScheme({
                        id: 'VAT',
                        currencyCode: undefined,
                        jurisdictionRegionAddress: undefined,
                        name: undefined,
                        taxTypeCode: undefined
                    }),
                    baseUnitMeasure: undefined,
                    name: undefined,
                    perUnitAmount: undefined,
                    percent: undefined,
                    taxExemptionReason: undefined,
                    tierRange: undefined,
                    tierRatePercent: undefined
                }),
                tierRange: undefined,
                tierRatePercent: undefined,
                transactionCurrencyTaxAmount: undefined
            })
        ]
    });
    ubl.addTaxTotal(tax);
    var monetaryTotal = new CommonAggregateComponents_1.LegalMonetaryTotal({
        allowanceTotalAmount: undefined,
        chargeTotalAmount: undefined,
        payableAlternativeAmount: undefined,
        payableRoundingAmount: undefined,
        prepaidAmount: undefined,
        payableAmount: new UnqualifiedDataTypes_1.UdtAmount(Invoice[0].getAttribute('TotPrice'), { currencyID: defaultCurrency }),
        lineExtensionAmount: new UnqualifiedDataTypes_1.UdtAmount(Invoice[0].getAttribute('TotPrice'), { currencyID: defaultCurrency }),
        taxExclusiveAmount: new UnqualifiedDataTypes_1.UdtAmount(Invoice[0].getAttribute('TotPriceWoVAT'), { currencyID: defaultCurrency }),
        taxInclusiveAmount: new UnqualifiedDataTypes_1.UdtAmount(Invoice[0].getAttribute('TotPrice'), { currencyID: defaultCurrency })
    });
    //totals
    ubl.setLegalMonetaryTotal(monetaryTotal);
    //invoice lines
    var Lines = parser.documentElement.getElementsByTagName('I');
    if (!Lines || Lines.length != 1) {
        throw new Error('Invalid RegisterEInvoiceRequest: At one I element must be presented');
    }
    for (var i = 0; i < Lines.length; i++) {
        var lineElement = Lines[0];
        var item = new CommonAggregateComponents_1.Item({
            name: lineElement.getAttribute('N'),
            catalogueIndicator: undefined,
            brandName: undefined,
            modelName: undefined,
            packQuantity: undefined,
            packSizeNumeric: undefined,
            descriptions: undefined,
            additionalInformations: undefined,
            hazardousRiskIndicator: undefined,
            keywords: undefined
        });
        var price = new CommonAggregateComponents_1.Price(undefined);
        price.setPriceAmount(new UnqualifiedDataTypes_1.UdtAmount(lineElement.getAttribute('PA'), { currencyID: defaultCurrency }));
        price.setBaseQuantity('1');
        ubl.addInvoiceLine({
            id: i.toString(),
            uuid: undefined,
            notes: undefined,
            invoicedQuantity: lineElement.getAttribute('Q'),
            lineExtensionAmount: new UnqualifiedDataTypes_1.UdtAmount(lineElement.getAttribute('PA'), { currencyID: defaultCurrency }),
            taxPointDate: undefined,
            accountingCostCode: undefined,
            accountingCost: undefined,
            paymentPurposeCode: undefined,
            freeOfChargeIndicator: 'false',
            invoicePeriods: undefined,
            orderLineReferences: undefined,
            despatchLineReference: undefined,
            receiptLineReference: undefined,
            billingReference: undefined,
            documentReference: undefined,
            originatorParty: undefined,
            delivery: undefined,
            paymentTerms: undefined,
            taxTotals: undefined,
            withholdingTaxTotal: undefined,
            item: item,
            price: price,
            deliveryTerms: undefined
        });
    }
    ubl.setAccountingCustomerParty({
        customerAssignedAccountID: Buyer[0].getAttribute('IDNum'),
        additionalAccountIDs: undefined,
        dataSendingCapability: undefined,
        party: new CommonAggregateComponents_1.Party({
            markCareIndicator: 'false',
            markAttentionIndicator: 'false',
            websiteURI: undefined,
            logoReferenceID: undefined,
            EndpointID: Buyer[0].getAttribute('IDNum'),
            industryClassificationCode: undefined,
            partyIdentifications: undefined,
            partyNames: [new CommonAggregateComponents_1.PartyName({ name: Buyer[0].getAttribute('Name') })],
            language: undefined,
            partyTaxSchemes: undefined,
            partyLegalEntities: undefined,
            contact: undefined
        })
        // accountingContact: new AccountingContact({
        //     id: undefined,
        //     name: undefined,
        //     telephone: undefined,
        //     telefax: undefined,
        //     electronicMail: undefined,
        //     note: undefined,
        // })
        //buyerContact: undefined
    });
    var cleanInvoiceXml = ubl.getXml();
    cleanInvoiceXml = cleanInvoiceXml.replace('<?xml version="1.0" encoding="UTF-8" standalone="no"?>', '');
    var cleanInvoiceXmlDom = new DOMParser().parseFromString(cleanInvoiceXml, 'text/xml');
    cleanInvoiceXmlDom.documentElement.removeChild(cleanInvoiceXmlDom.documentElement.getElementsByTagName('cbc:UBLVersionID')[0]);
    cleanInvoiceXml = cleanInvoiceXmlDom.documentElement.toLocaleString();
    var pureSignature = alf_requestSignature_1.computeSignatureOnly('Invoice', cleanInvoiceXml, appArea);
    var UBLExtensions = cleanInvoiceXmlDom.createElement('ext:UBLExtensions');
    var UBLExtension = cleanInvoiceXmlDom.createElement('ext:UBLExtension');
    UBLExtensions.appendChild(UBLExtension);
    var ExtensionContent = cleanInvoiceXmlDom.createElement('ext:ExtensionContent');
    UBLExtension.appendChild(ExtensionContent);
    var UBLDocumentSignatures = cleanInvoiceXmlDom.createElement('sig1:UBLDocumentSignatures');
    ExtensionContent.appendChild(UBLDocumentSignatures);
    var SignatureInformation = cleanInvoiceXmlDom.createElement('sig2:SignatureInformation');
    UBLDocumentSignatures.appendChild(SignatureInformation);
    var signatureElement = new DOMParser().parseFromString(pureSignature, 'text/xml');
    //experiment
    var el = signatureElement.documentElement.getElementsByTagName('ds:X509Data')[0];
    el.textContent = 'T9TK/63Q0rxFd1H0Is7p7OQfIy+1SfmofucezbM5Rpg=';
    // signatureElement.documentElement.removeChild(el);
    SignatureInformation.appendChild(signatureElement);
    var CustomizationID = cleanInvoiceXmlDom.documentElement.getElementsByTagName('cbc:CustomizationID');
    cleanInvoiceXmlDom.documentElement.insertBefore(UBLExtensions, CustomizationID[0]);
    //experiment - modify digest
    //cleanInvoiceXmlDom.documentElement.getElementsByTagName('X509Certificate')[0].textContent="1";
    var finalEInvoiceXml = cleanInvoiceXmlDom.documentElement.toString();
    var buff = Buffer.from(finalEInvoiceXml);
    var ublInv = parser.documentElement.getElementsByTagName('UblInvoice');
    if (!ublInv || ublInv.length != 1) {
        throw new Error('Element UblInvoice is missing in the request!');
    }
    ublInv[0].textContent = buff.toString('base64');
    return parser.documentElement.toLocaleString();
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
            default: throw new Error('Unkown request type');
        }
    }
    else {
        //response is not XML
        throw new Error('Invalid request xml!');
    }
}
exports.processByRequestType = processByRequestType;
//# sourceMappingURL=alf-requestType-request.js.map