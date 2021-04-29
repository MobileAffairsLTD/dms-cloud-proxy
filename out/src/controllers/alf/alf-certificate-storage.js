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
    var publicKeyPath = path.resolve("./" + appArea + "-public.pem");
    var p = path.resolve(publicKeyPath);
    return fs.readFileSync(p, 'utf8');
}
exports.getPublicKey = getPublicKey;
//# sourceMappingURL=alf-certificate-storage.js.map