const https = require('follow-redirects').https;


export function executeRequest(signedXml: string, isProduction: boolean): Promise<string> {
    return new Promise<any>((resolve, reject) => {
        const callback = function (response) {
            var str = ''
            response.on('data', function (chunk) {                                                           
                str += chunk;                    
            });            
            response.on('end', function (err) {
                if(this.statusCode!=200){
                    if(str)
                        reject(str)
                    else 
                        reject(this.statusMessage)                            
                }
                else {
                    resolve(str);
                }
            });
        }
        const soapRequest = `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"><SOAP-ENV:Header/><SOAP-ENV:Body>${signedXml}</SOAP-ENV:Body></SOAP-ENV:Envelope>`;
        const req = https.request(
            {
                rejectUnauthorized: false,
                method: 'POST', 
                hostname: isProduction?'efiskalizimi.tatime.gov.al':'efiskalizimi-test.tatime.gov.al',
                port: 443,
                path: '/FiscalizationService-v3',
                headers: {
                  'Content-Type': 'text/xml'
                },
                timeout: 10000,
                maxRedirects: 20                     
        }, callback);        
        req.on('error', function (err: any) {
            console.log('error soap', err);
            reject(err)
        });
        req.write(soapRequest);
        req.end();
    });
}

export function executeRequestEinvoice(signedXml: string, isProduction: boolean): Promise<string> {
    return new Promise<any>((resolve, reject) => {
        const callback = function (response) {
            var str = ''
            response.on('data', function (chunk) {                                                           
                str += chunk;                    
            });            
            response.on('end', function (err) {
                if(this.statusCode!=200){
                    if(str)
                        reject(str)
                    else 
                        reject(this.statusMessage)                            
                }
                else {
                    resolve(str);
                }
            });
        }
        const soapRequest = `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"><SOAP-ENV:Header/><SOAP-ENV:Body>${signedXml}</SOAP-ENV:Body></SOAP-ENV:Envelope>`;
        const req = https.request(
            {
                rejectUnauthorized: false,
                method: 'POST', 
                hostname: isProduction?'einvoice.tatime.gov.al':'einvoice-test.tatime.gov.al',
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
            console.log('error soap', err);
            reject(err)
        });
        req.write(soapRequest);
        req.end();
    });
}