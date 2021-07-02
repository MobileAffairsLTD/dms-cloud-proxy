"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeRequestEinvoice = exports.executeRequest = void 0;
var https = require('follow-redirects').https;
function executeRequest(signedXml, isProduction) {
    return new Promise(function (resolve, reject) {
        var callback = function (response) {
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
        var soapRequest = "<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\"><SOAP-ENV:Header/><SOAP-ENV:Body>" + signedXml + "</SOAP-ENV:Body></SOAP-ENV:Envelope>";
        var req = https.request({
            rejectUnauthorized: false,
            method: 'POST',
            hostname: isProduction ? 'efiskalizimi.tatime.gov.al' : 'efiskalizimi-test.tatime.gov.al',
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
function executeRequestEinvoice(signedXml, isProduction) {
    return new Promise(function (resolve, reject) {
        var callback = function (response) {
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
        var soapRequest = "<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\"><SOAP-ENV:Header/><SOAP-ENV:Body>" + signedXml + "</SOAP-ENV:Body></SOAP-ENV:Envelope>";
        var req = https.request({
            rejectUnauthorized: false,
            method: 'POST',
            hostname: isProduction ? 'einvoice.tatime.gov.al' : 'einvoice-test.tatime.gov.al',
            // hostname: 'einvoice-test.tatime.gov.al',               
            port: 443,
            path: '/EinvoiceService-v1',
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
exports.executeRequestEinvoice = executeRequestEinvoice;
//# sourceMappingURL=alf-request.js.map