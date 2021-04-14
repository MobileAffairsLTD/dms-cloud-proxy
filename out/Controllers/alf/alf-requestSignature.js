"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xml_crypto_1 = require("xml-crypto");
const crypto = require("crypto");
const alf_certificate_storage_1 = require("./alf-certificate-storage");
function X509KeyInfo(appArea) {
    this.getKeyInfo = function (key, prefix) {
        let publicKey = alf_certificate_storage_1.getPublicKey(appArea);
        let certInfo = publicKey.replace('-----BEGIN CERTIFICATE-----', '').replace('-----END CERTIFICATE-----', '').replace(/\s/g, '').replace(/(\r\n\t|\n|\r\t)/gm, '');
        prefix = prefix || '';
        prefix = prefix ? prefix + ':' : prefix;
        return `<${prefix}X509Data><X509Certificate>${certInfo}</X509Certificate></${prefix}X509Data>`;
    };
    this.getKey = function (keyInfo) {
        return alf_certificate_storage_1.getPublicKey(appArea);
    };
}
function computeSignedRequest(requestName, requestXml, appArea) {
    //     var xml = `<RegisterTCRRequest xmlns="https://eFiskalizimi.tatime.gov.al/FiscalizationService/schema" xmlns:ns2="http://www.w3.org/2000/09/xmldsig#" Id="Request" Version="3">
    // <Header SendDateTime="2021-04-10T02:43:00+02:00" UUID="e2caa8bc-91bf-429c-8919-e833367784c0" />
    // <TCR BusinUnitCode="ge484ak993" IssuerNUIS="L01714012M" MaintainerCode="zk772ct263" SoftCode="cc476bs902" TCRIntID="1" ValidFrom="2021-04-10" Type="REGULAR" />
    // </RegisterTCRRequest>`
    var sig = new xml_crypto_1.SignedXml();
    sig.keyInfoProvider = new X509KeyInfo(appArea);
    sig.signingKey = alf_certificate_storage_1.getPrivateCertificate(appArea);
    sig.signatureAlgorithm = 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256';
    sig.canonicalizationAlgorithm = 'http://www.w3.org/2001/10/xml-exc-c14n#';
    sig.addReference(`//*[local-name(.)='${requestName}']`, ['http://www.w3.org/2000/09/xmldsig#enveloped-signature',
        'http://www.w3.org/2001/10/xml-exc-c14n#'], "http://www.w3.org/2001/04/xmlenc#sha256");
    sig.computeSignature(requestXml);
    return sig.getSignedXml();
}
exports.computeSignedRequest = computeSignedRequest;
function calculateISC(privateKey, rawISC) {
    const sign = crypto.createSign('SHA256');
    sign.update(rawISC);
    const signature = sign.sign(privateKey, 'hex');
    const md5 = crypto.createHash('md5').update(signature).digest("hex");
    return { iscHash: md5, iscSignature: signature };
}
exports.calculateISC = calculateISC;
//# sourceMappingURL=alf-requestSignature.js.map