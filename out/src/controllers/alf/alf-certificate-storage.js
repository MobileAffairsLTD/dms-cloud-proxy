"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicKey = exports.getPrivateCertificate = void 0;
var path = require("path");
var fs = require("fs");
function getPrivateCertificate(appArea) {
    var certificatePath = path.resolve("./alf-certificates/" + appArea + ".pem");
    var p = path.resolve(certificatePath);
    return fs.readFileSync(p, 'utf8');
}
exports.getPrivateCertificate = getPrivateCertificate;
function getPublicKey(appArea) {
    //extracts public certificate from the private certificate
    var certificate = this.getPrivateCertificate(appArea);
    var beginCertString = '-----BEGIN CERTIFICATE-----';
    var endCertString = '-----END CERTIFICATE-----';
    var privateCert = certificate.substring(certificate.indexOf(beginCertString), certificate.indexOf(endCertString) + endCertString.length);
    return privateCert;
}
exports.getPublicKey = getPublicKey;
//# sourceMappingURL=alf-certificate-storage.js.map