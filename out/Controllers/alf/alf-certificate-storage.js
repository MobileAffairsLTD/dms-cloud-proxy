"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs = require("fs");
function getPrivateCertificate(appArea) {
    var certificatePath = path.resolve("./ISA.pem");
    var p = path.resolve(certificatePath);
    return fs.readFileSync(p, 'utf8');
}
exports.getPrivateCertificate = getPrivateCertificate;
function getPublicKey(appArea) {
    var publicKeyPath = path.resolve("./ISA-public.pem");
    var p = path.resolve(publicKeyPath);
    return fs.readFileSync(p, 'utf8');
}
exports.getPublicKey = getPublicKey;
//# sourceMappingURL=alf-certificate-storage.js.map