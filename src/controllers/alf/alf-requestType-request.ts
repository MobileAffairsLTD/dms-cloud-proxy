import { getPrivateCertificate } from "./alf-certificate-storage";
import { calculateISC, computeSignatureOnly, computeSignedRequest } from "./alf-requestSignature";
import { Invoice as ublInvoice } from 'ubl-builder';
import { AccountingContact, AccountingCustomerParty, AccountingSupplierParty, Item, LegalMonetaryTotal, Party, PartyName, PaymentMeans, PhysicalLocation, Price, TaxCategory, TaxScheme, TaxSubtotal, TaxTotal } from "ubl-builder/lib/ubl21/CommonAggregateComponents";
import { UdtAmount } from "ubl-builder/lib/ubl21/types/UnqualifiedDataTypes";
import { UBLExtensions, UBLExtensionType } from "ubl-builder/lib/ubl21/extensionComponents";
import { SignatureExtensions } from 'ubl-builder/lib/ubl21/extensionComponents/customExtensionContents/SignatureExtensions'
import AnyExtensionContent from "ubl-builder/lib/ubl21/extensionComponents/AnyExtensionContent";
import { handleDmsCalculateIICResponse } from "./alf-requestType-response";
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


function handleRegisterEInvoiceRequest(appArea: string, parser: Document): string {

    const defaultCurrency = 'ALL';
    const Invoice = parser.documentElement.getElementsByTagName('Invoice');
    if (!Invoice || Invoice.length != 1) {
        throw new Error('Invalid RegisterEInvoiceRequest: Invoice element is missing');
    }

    const SameTax = parser.documentElement.getElementsByTagName('SameTax');
    if (!SameTax || SameTax.length != 1) {
        throw new Error('Invalid RegisterEInvoiceRequest: SameTax element is missing');
    }

    const Seller = parser.documentElement.getElementsByTagName('Seller');
    if (!Seller || Seller.length != 1) {
        throw new Error('Invalid RegisterEInvoiceRequest: Seller element is missing');
    }

    const Buyer = parser.documentElement.getElementsByTagName('Buyer');
    if (!Buyer || Buyer.length != 1) {
        throw new Error('Invalid RegisterEInvoiceRequest: Buyer element is missing');
    }


    const {iic, iicSignature } = handleDmsCalculateIICResponse(appArea, Invoice.toString() );

    const ubl = new ublInvoice(Invoice[0].getAttribute('InvNum'), {
        software: {
            id: Invoice[0].getAttribute('InvNum'),
            pin: undefined,
            providerNit: undefined,
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
    ubl.addProperty('xmlns:sig2','urn:oasis:names:specification:ubl:schema:xsd:SignatureAggregateComponents-2');
    ubl.addProperty('xmlns:sig1','urn:oasis:names:specification:ubl:schema:xsd:CommonSignatureComponents-2');

    const issueDateTime = Invoice[0].getAttribute('IssueDateTime');
    ubl.setIssueTime(issueDateTime.split('T')[1]);
    ubl.setCustomizationID('urn:cen.eu:en16931:2017');
    ubl.setDueDate(issueDateTime.split('T')[0]);
    ubl.setProfileID('P1');
    ubl.setInvoiceTypeCode('380');
    ubl.setDocumentCurrencyCode(defaultCurrency);
    ubl.setTaxCurrencyCode(defaultCurrency);
    ubl.setDocumentCurrencyCode(defaultCurrency);
    ubl.addNote(`IIC=${iic}`);
    ubl.addNote(`IICSignature=${iicSignature}`);
    ubl.addNote(`FIC=${'fic1'}`);
    ubl.addNote(`IssueDateTime=${issueDateTime}`);
    ubl.addNote(`OperatorCode=${Invoice[0].getAttribute('OperatorCode')}`);
    ubl.addNote(`BusinessUnitCode=${Invoice[0].getAttribute('BusinUnitCode')}`);
    ubl.addNote(`SoftwareCode=${Invoice[0].getAttribute('SoftCode')}`);
    ubl.addNote(`IsBadDebtInv=${'false'}`);


    const party = new Party({
        EndpointID: Seller[0].getAttribute('IDNum'),
        contact: undefined,
        industryClassificationCode: undefined,
        language: undefined,
        logoReferenceID: undefined,
        markAttentionIndicator: undefined,
        markCareIndicator: undefined,
        partyIdentifications: undefined,
        partyLegalEntities: undefined,
        partyNames: [new PartyName({ name: Seller[0].getAttribute('Name') })],
        partyTaxSchemes: undefined,
        websiteURI: undefined,
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

    ubl.setAccountingSupplierParty(new AccountingSupplierParty({
        additionalAccountIDs: undefined,
        customerAssignedAccountID: undefined,
        dataSendingCapability: undefined,
        party: party
    }))
    // ubl.setAccountingCustomerParty()

    const paymentMeans = new PaymentMeans({
        id: undefined,
        paymentMeansCode: '54',
        paymentDueDate: undefined,
        paymentChannelCode: undefined,
        instructionID: undefined,
        instructionNotes: undefined,
        paymentID: undefined,
    });
    ubl.addPaymentMeans(paymentMeans)

    //taxes
    const tax = new TaxTotal({
        roundingAmount: undefined,
        taxAmount: new UdtAmount(Invoice[0].getAttribute('TotVATAmt'), { currencyID: defaultCurrency }),
        taxEvidenceIndicator: undefined,
        taxSubtotals: [
            new TaxSubtotal({
                taxAmount: new UdtAmount(Invoice[0].getAttribute('TotVATAmt'), { currencyID: defaultCurrency }),
                taxableAmount: new UdtAmount(Invoice[0].getAttribute('TotPriceWoVAT'), { currencyID: defaultCurrency }),
                baseUnitMeasure: undefined,
                calculationSequenceNumeric: undefined,
                perUnitAmount: undefined,
                percent: SameTax[0].getAttribute('VATRate'),
                taxCategory: new TaxCategory(
                    {
                        id: 'O',
                        taxExemptionReasonCode: 'vatex-eu-o',
                        taxScheme: new TaxScheme({
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
                    }
                ),
                tierRange: undefined,
                tierRatePercent: undefined,
                transactionCurrencyTaxAmount: undefined,
            })
        ]
    });
    ubl.addTaxTotal(tax);
    const monetaryTotal = new LegalMonetaryTotal({
        allowanceTotalAmount: undefined,
        chargeTotalAmount: undefined,
        payableAlternativeAmount: undefined,
        payableRoundingAmount: undefined,
        prepaidAmount: undefined,
        payableAmount: new UdtAmount(Invoice[0].getAttribute('TotPrice'), { currencyID: defaultCurrency }),
        lineExtensionAmount: new UdtAmount(Invoice[0].getAttribute('TotPrice'), { currencyID: defaultCurrency }),
        taxExclusiveAmount: new UdtAmount(Invoice[0].getAttribute('TotPriceWoVAT'), { currencyID: defaultCurrency }),
        taxInclusiveAmount: new UdtAmount(Invoice[0].getAttribute('TotPrice'), { currencyID: defaultCurrency }),
    });
    //totals
    ubl.setLegalMonetaryTotal(monetaryTotal);
    
    //invoice lines
    const Lines = parser.documentElement.getElementsByTagName('I');
    if (!Lines || Lines.length != 1) {
        throw new Error('Invalid RegisterEInvoiceRequest: At one I element must be presented');
    }

    
    for(let i=0;i<Lines.length;i++){
        const lineElement = Lines[0];
        const item = new Item({
            name: lineElement.getAttribute('N'),
            catalogueIndicator: undefined,
            brandName: undefined,
            modelName: undefined,
            packQuantity: undefined,
            packSizeNumeric: undefined,
            descriptions: undefined,
            additionalInformations: undefined,
            hazardousRiskIndicator: undefined,
            keywords: undefined,
        });
    
    
        const price = new Price(undefined);
        price.setPriceAmount(new UdtAmount(lineElement.getAttribute('PA'), { currencyID: defaultCurrency }));
        price.setBaseQuantity('1');
       
        ubl.addInvoiceLine({
            id: i.toString(),
            uuid: undefined,
            notes: undefined,
            invoicedQuantity: lineElement.getAttribute('Q'),
            lineExtensionAmount: new UdtAmount(lineElement.getAttribute('PA'), { currencyID: defaultCurrency }),
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
        })
    }
   



    ubl.setAccountingCustomerParty({
        customerAssignedAccountID: Buyer[0].getAttribute('IDNum'),
        additionalAccountIDs: undefined,
        dataSendingCapability: undefined,
        party: new Party(
            {
                markCareIndicator: 'false',
                markAttentionIndicator: 'false',
                websiteURI: undefined,
                logoReferenceID: undefined,
                EndpointID: Buyer[0].getAttribute('IDNum'),
                industryClassificationCode: undefined,
                partyIdentifications: undefined,
                partyNames: [new PartyName({ name: Buyer[0].getAttribute('Name') })],
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
    })


    let cleanInvoiceXml = ubl.getXml();
    cleanInvoiceXml = cleanInvoiceXml.replace('<?xml version="1.0" encoding="UTF-8" standalone="no"?>','');
    const cleanInvoiceXmlDom = new DOMParser().parseFromString(cleanInvoiceXml, 'text/xml');
    cleanInvoiceXmlDom.documentElement.removeChild(cleanInvoiceXmlDom.documentElement.getElementsByTagName('cbc:UBLVersionID')[0]);
    cleanInvoiceXml = cleanInvoiceXmlDom.documentElement.toLocaleString();

    const pureSignature = computeSignatureOnly('Invoice', cleanInvoiceXml, appArea);


    

    const UBLExtensions = cleanInvoiceXmlDom.createElement('ext:UBLExtensions');
    const UBLExtension = cleanInvoiceXmlDom.createElement('ext:UBLExtension');
    UBLExtensions.appendChild(UBLExtension);
    const ExtensionContent = cleanInvoiceXmlDom.createElement('ext:ExtensionContent');
    UBLExtension.appendChild(ExtensionContent);
    const UBLDocumentSignatures = cleanInvoiceXmlDom.createElement('sig1:UBLDocumentSignatures');
    ExtensionContent.appendChild(UBLDocumentSignatures);
    const SignatureInformation = cleanInvoiceXmlDom.createElement('sig2:SignatureInformation',);
    UBLDocumentSignatures.appendChild(SignatureInformation);
    const signatureElement = new DOMParser().parseFromString(pureSignature, 'text/xml'); 
   
    //experiment
    ///let el = signatureElement.documentElement.getElementsByTagName('ds:X509Data')[0];
    //el.textContent = 'T9TK/63Q0rxFd1H0Is7p7OQfIy+1SfmofucezbM5Rpg='
    // signatureElement.documentElement.removeChild(el);

   
    SignatureInformation.appendChild(signatureElement);

   
    const CustomizationID = cleanInvoiceXmlDom.documentElement.getElementsByTagName('cbc:CustomizationID');
    cleanInvoiceXmlDom.documentElement.insertBefore(UBLExtensions, CustomizationID[0]);
   

    //experiment - modify digest
   //cleanInvoiceXmlDom.documentElement.getElementsByTagName('X509Certificate')[0].textContent="1";
    
    const finalEInvoiceXml = cleanInvoiceXmlDom.documentElement.toString();
    const buff = Buffer.from(finalEInvoiceXml);

    const ublInv = parser.documentElement.getElementsByTagName('UblInvoice');
    if (!ublInv || ublInv.length != 1) {
        throw new Error('Element UblInvoice is missing in the request!');
    }
    ublInv[0].textContent = buff.toString('base64');
    return parser.documentElement.toLocaleString();
}

export function processByRequestType(appArea: string, requestType: string, xml: string): { transformedRequest: string; skipUplinkRequest: boolean } {
    const parser = new DOMParser().parseFromString(xml, 'text/xml');
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
        throw new Error('Invalid request xml!')
    }
}