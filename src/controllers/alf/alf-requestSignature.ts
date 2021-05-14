import { SignedXml } from 'xml-crypto';
import * as  fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { getPrivateCertificate, getPublicKey } from './alf-certificate-storage';


// var xmldsigjs = require("xmldsigjs");
// import { Crypto as WebCrypto } from "node-webcrypto-ossl";

// const webCrypto = new WebCrypto();
// xmldsigjs.Application.setEngine("OpenSSL", webCrypto);


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

export function computeSignedRequest(requestName: string, requestXml: string, appArea: string): string {


    //     var xml = `<RegisterTCRRequest xmlns="https://eFiskalizimi.tatime.gov.al/FiscalizationService/schema" xmlns:ns2="http://www.w3.org/2000/09/xmldsig#" Id="Request" Version="3">
    // <Header SendDateTime="2021-04-10T02:43:00+02:00" UUID="e2caa8bc-91bf-429c-8919-e833367784c0" />
    // <TCR BusinUnitCode="ge484ak993" IssuerNUIS="L01714012M" MaintainerCode="zk772ct263" SoftCode="cc476bs902" TCRIntID="1" ValidFrom="2021-04-10" Type="REGULAR" />
    // </RegisterTCRRequest>`

    var sig = new SignedXml();
    sig.keyInfoProvider = new X509KeyInfo(appArea);
    sig.signingKey = getPrivateCertificate(appArea)
    sig.signatureAlgorithm = 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256';
    sig.canonicalizationAlgorithm = 'http://www.w3.org/2001/10/xml-exc-c14n#';
    sig.addReference(`//*[local-name(.)='${requestName}']`,
        ['http://www.w3.org/2000/09/xmldsig#enveloped-signature',
            'http://www.w3.org/2001/10/xml-exc-c14n#'],
        "http://www.w3.org/2001/04/xmlenc#sha256");
    sig.computeSignature(requestXml);
    return sig.getSignedXml();
}

export function computeEinvoiceSignature(rootTag: string, requestXml: string, appArea: string): string {
    var sig = new SignedXml();
    sig.keyInfoProvider = new X509KeyInfo(appArea);
    sig.signingKey = getPrivateCertificate(appArea)
    sig.signatureAlgorithm = 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256';
    sig.canonicalizationAlgorithm = 'http://www.w3.org/2001/10/xml-exc-c14n#';
    sig.addReference(`//*[local-name(.)='${rootTag}']`,
        ['http://www.w3.org/2000/09/xmldsig#enveloped-signature',
            'http://www.w3.org/2001/10/xml-exc-c14n#'],
        "http://www.w3.org/2001/04/xmlenc#sha256",'',null,null,true);
    sig.computeSignature(requestXml);
    return sig.getSignatureXml();
}

// export function computeEinvoiceSignature(rootTag: string,requestXml: string, appArea: string): string {    
//     var sig = new SignedXml();
//     sig.keyInfoProvider = new X509KeyInfo(appArea);
//     sig.signingKey = getPrivateCertificate(appArea)
//     sig.signatureAlgorithm = 'http://www.w3.org/2000/09/xmldsig#rsa-sha1';
//     sig.canonicalizationAlgorithm = 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315';
//     sig.addReference(`//*[local-name(.)='${rootTag}']`,            
//     ['http://www.w3.org/2000/09/xmldsig#enveloped-signature'],
//         "http://www.w3.org/2000/09/xmldsig#sha1");      
//     sig.computeSignature(requestXml),{prefix:'ds'};
//     return sig.getSignatureXml();
// }

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

// async function SignXml(xmlString, appArea): Promise<any> {
//     const crypto = new WebCrypto();
//     const hash = 'SHA-256';
//     const alg = {
//         name: "RSASSA-PKCS1-v1_5",
//         hash
//     }
//     // Read cert
//     const certPem = fs.readFileSync(`./${appArea}-public.pem`, { encoding: "utf8" });
//     const certDer = pem2der(certPem);
//     // Read key
//     const keyPem = fs.readFileSync(`./${appArea}-private.pem`, { encoding: "utf8" });
//     const keyDer = pem2der(keyPem)
//     const key = await crypto.subtle.importKey("pkcs8", keyDer, alg, false, ["sign"]);
//     var xml = xmldsigjs.Parse(xmlString);
//     var xadesXml = new xmldsigjs.SignedXml();
//     const x509 = preparePem(certPem);
//     const signature = await xadesXml.Sign(     // Signing document
//         alg,                                    // algorithm
//         key,                                    // key
//         xml,                                    // document
//         {                                       // options
//             references: [
//                 { uri:"",hash, transforms: ["exc-c14n", "enveloped"] }
//             ],
//             // policy: {
//             //     hash,
//             //     identifier: {
//             //         qualifier: "OIDAsURI",
//             //         value: "quilifier.uri",
//             //     },
//             //     // qualifiers: [
//             //     //     {
//             //     //         noticeRef: {
//             //     //             organization: "PeculiarVentures",
//             //     //             noticeNumbers: [1, 2, 3, 4, 5]
//             //     //         }
//             //     //     }
//             //     // ]
//             // },
//             // productionPlace: {
//             //     country: "Russia",
//             //     state: "Marij El",
//             //     city: "Yoshkar-Ola",
//             //     code: "424000",
//             // },
//             signingCertificate: x509,
//             x509: [x509]
//         });
//     const s = signature.GetXml()
//     const oSerializer = new XMLSerializer(); 
//     const sXML = oSerializer.serializeToString(s);
//     return sXML
// }

// export async function computeEinvoiceSignature(rootTag: string, requestXml: string, appArea: string): Promise<string> {
//     const sdoc = await SignXml(requestXml, appArea);
//     return sdoc;
// }




export function calculateISC(privateKey: string, rawISC: any): any {
    const sign = crypto.createSign('SHA256');
    sign.update(rawISC);
    const signature = sign.sign(privateKey, 'hex');
    const md5 = crypto.createHash('md5').update(signature).digest("hex");
    return { iscHash: md5, iscSignature: signature };
}