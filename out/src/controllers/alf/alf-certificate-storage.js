"use strict";
exports.__esModule = true;
exports.getPublicKey = exports.getPrivateCertificate = void 0;
var path = require("path");
var fs = require("fs");
function getPrivateCertificate(appArea) {
    var certificatePath = path.resolve("./" + appArea + ".pem");
    var p = path.resolve(certificatePath);
    return fs.readFileSync(p, 'utf8');
}
exports.getPrivateCertificate = getPrivateCertificate;
function getPublicKey(appArea) {
    // const publicKeyPath = path.resolve(`./${appArea}-public.pem`);
    // const p = path.resolve(publicKeyPath);
    // return fs.readFileSync(p,'utf8');
    //extracts public certificate from the private certificate
    var certificate = this.getPrivateCertificate(appArea);
    var beginCertString = '-----BEGIN CERTIFICATE-----';
    var endCertString = '-----END CERTIFICATE-----';
    var privateCert = certificate.substring(certificate.indexOf(beginCertString), certificate.indexOf(endCertString) + endCertString.length);
    console.log(privateCert);
    return privateCert;
}
exports.getPublicKey = getPublicKey;
//# sourceMappingURL=alf-certificate-storage.js.map