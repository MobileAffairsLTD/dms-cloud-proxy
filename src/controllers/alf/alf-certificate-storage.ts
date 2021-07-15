import * as path from 'path';
import * as fs from 'fs';
import { CloudAdapter } from '../../adapters/cloud-adapter';


export function getLocalPrivateCertificate(appArea: string): string {
    let certificate = '';
    try {
    const certificatePath = path.resolve(`./alf-certificates/${appArea}-alf-certificate.pem`);
    const p = path.resolve(certificatePath);
    certificate = fs.readFileSync(p, 'utf8');
    } catch (error) {
        throw new Error('Internal error. Missing local certificate.');
    }
    return certificate;
}

// export async function getPrivateCertificate(apiKey, appArea: string): Promise<string> {
//     try {
//         const localCertificate = this.getLocalPrivateCertificate(appArea);
//         return localCertificate;
//     } catch {
//         const cloudCertificate = await this.downloadPrivateCertificateFromCloud(apiKey, appArea);
//         await this.overwriteLocalPrivateCertificate(appArea, cloudCertificate);
//         return cloudCertificate;
//     }
// }

export function getLocalPrivateCertificateDate(appArea: string): Date {
    const certificatePath = path.resolve(`./alf-certificates/${appArea}-alf-certificate.pem`);
    const p = path.resolve(certificatePath);
    const stats = fs.statSync(p);
    const mtime = stats.mtime;
    return mtime;
}

export function getPublicKey(appArea: string): string {
    //extracts public certificate from the private certificate
    const certificate: string = this.getLocalPrivateCertificate(appArea);
    const beginCertString = '-----BEGIN CERTIFICATE-----';
    const endCertString = '-----END CERTIFICATE-----';

    const privateCert = certificate.substring(certificate.indexOf(beginCertString), certificate.indexOf(endCertString) + endCertString.length);
    return privateCert;
}
export async function downloadPrivateCertificateFromCloud(apiKey: string, appArea: string): Promise<string> {
    const cloudAdapter = new CloudAdapter(appArea, apiKey);
    const certificatePath = path.resolve(`./alf-certificates/${appArea}-alf-certificate.pem`);
    const p = path.resolve(certificatePath);
    let alfCertificate: any;
    try {
        alfCertificate = await cloudAdapter.getALFCertificate();
        return alfCertificate;
    } catch (err) {
        console.log(err);
    }

}

export async function overwriteLocalPrivateCertificate(appArea: string, privateCertificate: string): Promise<any> {
    const certificatePath = path.resolve(`./alf-certificates/${appArea}-alf-certificate.pem`);
    const p = path.resolve(certificatePath);
    try {
        fs.writeFileSync(p, privateCertificate);
    } catch (err) {
        console.log(err);
    }
}

export async function compareAndReplaceCertificates(apiKey: string, appArea: string) {
    const cloudAdapter = new CloudAdapter(appArea, apiKey);
    const cloudCertificateDate = await cloudAdapter.getALFCertificateDate();
    let localCertificateDate = new Date(0);
    try {
        localCertificateDate = getLocalPrivateCertificateDate(appArea);
    } catch (error) {
        console.log('Missing local certificate');
    }
    // console.log('cloudCert', cloudCertificateDate);
    // console.log('localCert', localCertificateDate);
    if (cloudCertificateDate > localCertificateDate) {
        console.log('changing local certificate');
        const privateCertificate = await downloadPrivateCertificateFromCloud(apiKey, appArea);
        await overwriteLocalPrivateCertificate(appArea, privateCertificate);
    }
}