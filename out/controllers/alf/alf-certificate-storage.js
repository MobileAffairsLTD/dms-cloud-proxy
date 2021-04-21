import * as path from 'path';
import * as fs from 'fs';
export function getPrivateCertificate(appArea) {
    const certificatePath = path.resolve("./ISA.pem");
    const p = path.resolve(certificatePath);
    return fs.readFileSync(p, 'utf8');
}
export function getPublicKey(appArea) {
    const publicKeyPath = path.resolve("./ISA-public.pem");
    const p = path.resolve(publicKeyPath);
    return fs.readFileSync(p, 'utf8');
}
//# sourceMappingURL=alf-certificate-storage.js.map