"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
function getPrivateCertificate(appArea) {
    const certificatePath = path.resolve("./ISA.pem");
    const p = path.resolve(certificatePath);
    return fs.readFileSync(p, 'utf8');
}
exports.getPrivateCertificate = getPrivateCertificate;
function getPublicKey(appArea) {
    const publicKeyPath = path.resolve("./ISA-public.pem");
    const p = path.resolve(publicKeyPath);
    return fs.readFileSync(p, 'utf8');
}
exports.getPublicKey = getPublicKey;
//# sourceMappingURL=alf-certificate-storage.js.map