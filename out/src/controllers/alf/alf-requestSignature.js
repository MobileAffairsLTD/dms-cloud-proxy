"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateISC = exports.computeEinvoiceSignature = exports.computeSignedRequest = void 0;
var xml_crypto_1 = require("xml-crypto");
var crypto = require("crypto");
var alf_certificate_storage_1 = require("./alf-certificate-storage");
function X509KeyInfo(appArea) {
    this.getKeyInfo = function (key, prefix) {
        var publicKey = alf_certificate_storage_1.getPublicKey(appArea);
        var certInfo = publicKey.replace('-----BEGIN CERTIFICATE-----', '').replace('-----END CERTIFICATE-----', '').replace(/\s/g, '').replace(/(\r\n\t|\n|\r\t)/gm, '');
        prefix = prefix || '';
        prefix = prefix ? prefix + ':' : prefix;
        return "<" + prefix + "X509Data><X509Certificate>" + certInfo + "</X509Certificate></" + prefix + "X509Data>";
    };
    this.getKey = function (keyInfo) {
        return alf_certificate_storage_1.getPublicKey(appArea);
    };
}
function computeSignedRequest(requestName, requestXml, appArea) {
    var sig = new xml_crypto_1.SignedXml();
    sig.keyInfoProvider = new X509KeyInfo(appArea);
    sig.signingKey = alf_certificate_storage_1.getPrivateCertificate(appArea);
    sig.signatureAlgorithm = 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256';
    sig.canonicalizationAlgorithm = 'http://www.w3.org/2001/10/xml-exc-c14n#';
    sig.addReference("//*[local-name(.)='" + requestName + "']", ['http://www.w3.org/2000/09/xmldsig#enveloped-signature',
        'http://www.w3.org/2001/10/xml-exc-c14n#'], "http://www.w3.org/2001/04/xmlenc#sha256");
    sig.computeSignature(requestXml);
    return sig.getSignedXml();
}
exports.computeSignedRequest = computeSignedRequest;
function computeEinvoiceSignature(rootTag, requestXml, appArea) {
    var sig = new xml_crypto_1.SignedXml();
    sig.keyInfoProvider = new X509KeyInfo(appArea);
    sig.signingKey = alf_certificate_storage_1.getPrivateCertificate(appArea);
    sig.signatureAlgorithm = 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256';
    sig.canonicalizationAlgorithm = 'http://www.w3.org/2001/10/xml-exc-c14n#';
    sig.addReference("//*[local-name(.)='" + rootTag + "']", ['http://www.w3.org/2000/09/xmldsig#enveloped-signature',
        'http://www.w3.org/2001/10/xml-exc-c14n#'], "http://www.w3.org/2001/04/xmlenc#sha256", '', null, null, true);
    sig.computeSignature(requestXml);
    return sig.getSignatureXml();
}
exports.computeEinvoiceSignature = computeEinvoiceSignature;
function preparePem(pem) {
    return pem
        // remove BEGIN/END
        .replace(/-----(BEGIN|END)[\w\d\s]+-----/g, "")
        // remove \r, \n
        .replace(/[\r\n]/g, "");
}
function pem2der(pem) {
    pem = preparePem(pem);
    // convert base64 to ArrayBuffer
    return new Uint8Array(Buffer.from(pem, "base64")).buffer;
}
function str2ab(str) {
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}
function calculateISC(privateKey, rawISC) {
    var sign = crypto.createSign('SHA256');
    sign.update(rawISC);
    var signature = sign.sign(privateKey, 'hex');
    var md5 = crypto.createHash('md5').update(signature).digest("hex");
    return { iscHash: md5, iscSignature: signature };
}
exports.calculateISC = calculateISC;
//# sourceMappingURL=alf-requestSignature.js.map