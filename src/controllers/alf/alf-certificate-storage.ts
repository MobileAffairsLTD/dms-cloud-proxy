import * as path  from 'path';
import * as fs  from 'fs';

export function getPrivateCertificate(appArea: string): string {
    const certificatePath = path.resolve(`./alf-certificates/${appArea}.pem`);
    const p = path.resolve(certificatePath);
    return fs.readFileSync(p,'utf8');
} 

export function getPublicKey(appArea: string): string{
    // const publicKeyPath = path.resolve(`./${appArea}-public.pem`);
    // const p = path.resolve(publicKeyPath);
    // return fs.readFileSync(p,'utf8');

    //extracts public certificate from the private certificate
    const certificate: string = this.getPrivateCertificate(appArea);
    const beginCertString = '-----BEGIN CERTIFICATE-----';
    const endCertString = '-----END CERTIFICATE-----';
    
    const privateCert =  certificate.substring(certificate.indexOf(beginCertString),certificate.indexOf(endCertString)+endCertString.length);
    return privateCert;
} 