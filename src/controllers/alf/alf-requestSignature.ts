import { SignedXml } from 'xml-crypto';
import * as crypto from 'crypto';
import { getPrivateCertificate, getPublicKey } from './alf-certificate-storage';



function X509KeyInfo(appArea: string) {

    this.getKeyInfo = function (key: string, prefix: string) {
        let publicKey = getPublicKey(appArea)
        let certInfo = publicKey.replace('-----BEGIN CERTIFICATE-----', '').replace('-----END CERTIFICATE-----', '').replace(/\s/g, '').replace(/(\r\n\t|\n|\r\t)/gm, '');
        prefix = prefix || ''
        prefix = prefix ? prefix + ':' : prefix
        return `<${prefix}X509Data><X509Certificate>${certInfo}</X509Certificate></${prefix}X509Data>`;
    }

    this.getKey = function (keyInfo) {
        return getPublicKey(appArea);
    }
}

export async function computeSignedRequest(apiKey: string, requestName: string, requestXml: string, appArea: string): Promise<string> {

    var sig = new SignedXml();
    sig.keyInfoProvider = new X509KeyInfo(appArea);
    sig.signingKey = await getPrivateCertificate(apiKey, appArea)
    sig.signatureAlgorithm = 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256';
    sig.canonicalizationAlgorithm = 'http://www.w3.org/2001/10/xml-exc-c14n#';
    sig.addReference(`//*[local-name(.)='${requestName}']`,
        ['http://www.w3.org/2000/09/xmldsig#enveloped-signature',
            'http://www.w3.org/2001/10/xml-exc-c14n#'],
        "http://www.w3.org/2001/04/xmlenc#sha256");
    sig.computeSignature(requestXml);
    return sig.getSignedXml();
}

export async function computeEinvoiceSignature(apiKey: string, rootTag: string, requestXml: string, appArea: string): Promise<string> {
    var sig = new SignedXml();
    sig.keyInfoProvider = new X509KeyInfo(appArea);
    sig.signingKey = getPrivateCertificate(apiKey, appArea)
    sig.signatureAlgorithm = 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256';
    sig.canonicalizationAlgorithm = 'http://www.w3.org/2001/10/xml-exc-c14n#';
    sig.addReference(`//*[local-name(.)='${rootTag}']`,
        ['http://www.w3.org/2000/09/xmldsig#enveloped-signature',
            'http://www.w3.org/2001/10/xml-exc-c14n#'],
        "http://www.w3.org/2001/04/xmlenc#sha256",'',null,null,true);
    sig.computeSignature(requestXml);
    return sig.getSignatureXml();
}

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
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}



export function calculateISC(privateKey: string, rawISC: any): any {
    const sign = crypto.createSign('SHA256');
    sign.update(rawISC);
    const signature = sign.sign(privateKey, 'hex');
    const md5 = crypto.createHash('md5').update(signature).digest("hex");
    return { iscHash: md5, iscSignature: signature };
}