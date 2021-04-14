"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https = require('follow-redirects').https;
function executeRequest(signedXml) {
    return new Promise((resolve, reject) => {
        const callback = function (response) {
            var str = '';
            response.on('data', function (chunk) {
                str += chunk;
            });
            response.on('end', function (err) {
                if (this.statusCode != 200) {
                    if (str)
                        reject(str);
                    else
                        reject(this.statusMessage);
                }
                else {
                    resolve(str);
                }
            });
        };
        const soapRequest = `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"><SOAP-ENV:Header/><SOAP-ENV:Body>${signedXml}</SOAP-ENV:Body></SOAP-ENV:Envelope>`;
        const req = https.request({
            rejectUnauthorized: false,
            method: 'POST',
            hostname: 'efiskalizimi-test.tatime.gov.al',
            port: 443,
            path: '/FiscalizationService-v3',
            headers: {
                'Content-Type': 'text/xml'
            },
            timeout: 10000,
            maxRedirects: 20
        }, callback);
        req.on('error', function (err) {
            reject(err);
        });
        req.write(soapRequest);
        req.end();
    });
}
exports.executeRequest = executeRequest;
//# sourceMappingURL=alf-request.js.map