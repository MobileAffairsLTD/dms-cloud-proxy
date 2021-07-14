var https = require('https');

export class CloudAdapter {
    constructor(
        protected appArea: string,
        protected apiKey: string) {
    }

    private static async createGetRequest(url: string): Promise<string> {
        return new Promise<any>((resolve, reject) => {
            const callback = function (response) {
                var str = ''
                response.on('data', function (chunk) {
                    str += chunk;
                });
                response.on('end', function (err) {
                    if (this.statusCode != 200) {
                        if (str)
                            reject(str)
                        else
                            reject(this.statusMessage)
                    }
                    else {
                        resolve(str);
                    }
                });
            }
            const req = https.get(url, callback);
            req.on('error', function (err) {
                reject(err)
            });
            req.end();
        });
    }

    private static async createRequest(options: { method: string, host: string; path?: string; port?: number; protocol?: string, headers?: Record<string, string> }, body?: any): Promise<string> {
        let data;
        if (body) {
            data = new TextEncoder().encode(
                JSON.stringify(body));
            options.headers['Content-Length'] = data.length.toString();
        }
        return new Promise<any>((resolve, reject) => {
            const callback = function (response) {
                var str = ''
                response.on('data', function (chunk) {
                    str += chunk;
                });
                response.on('end', function (err) {
                    if (this.statusCode != 200) {
                        if (str)
                            reject(str)
                        else
                            reject(this.statusMessage)
                    }
                    else {
                        resolve(str);
                    }
                });
            }
            const req = https.request(options, callback);
            req.on('error', function (err) {
                console.log('cloud errr', err);
                reject(err)
            });
            if (body) {
                req.write(data);
            }
            req.end();
        });
    }

    async getALFCertificate(): Promise<string> {
        return await this.fileDownload(`${this.appArea}-alf-certificate.pem`, 'cert');
    }

    async getALFCertificateDate(): Promise<Date> {
        let certificateMetaData = await this.getEntity('Certificate');
        console.log(typeof certificateMetaData);
        certificateMetaData = JSON.parse(certificateMetaData);

        console.log('cert001', certificateMetaData);
        console.log('cert002', certificateMetaData[0]);
        if (certificateMetaData.length > 0) {
            const uploadDate = certificateMetaData[0].uploadDate;
            console.log(uploadDate);
            return new Date(uploadDate);
        }
    }
    async uploadALFPacket(fileName: string, fileContent: string) {
        return await this.fileUpload(fileName, fileContent, 'alf-packets');
    }

    async fileDownload(fileName: string, directory: string): Promise<string> {
        const certificateSignedUrl = await CloudAdapter.createRequest({
            method: 'get', host: 'api.portal.dynamicsmobile.com', path: `/storage/file2/${this.appArea}/${fileName}?root=${directory}`,
            headers: { 'x-api-key': this.apiKey }
        });
        const parsedCertificateSignedUrl = JSON.parse(certificateSignedUrl);
        return await CloudAdapter.createGetRequest(parsedCertificateSignedUrl.url);
    }

    async fileUpload(fileName: string, fileContent: string, directory: string) {
        let fileSignedUrl: any = await CloudAdapter.createRequest({
            method: 'post', host: 'api.portal.dynamicsmobile.com', path: `/storage/file2/${this.appArea}/${fileName}?root=${directory}`,
            headers: { "Content-Type": "application/json", 'x-api-key': this.apiKey }
        });
        fileSignedUrl = JSON.parse(fileSignedUrl);

        const host = fileSignedUrl.signedUrl.split('com/')[0].replace('https://', '') + 'com';
        const path = '/' + fileSignedUrl.signedUrl.split('com/')[1];
        await CloudAdapter.createRequest({ protocol: "https:", method: 'PUT', headers: { "Content-Type": "application/json" }, host: host, path: path }, fileContent);
    }

    async addEntity(entityName: string, entityValue: string) {
        await CloudAdapter.createRequest({
            method: 'post', host: 'api.portal.dynamicsmobile.com', path: `/livelink/entity/${this.appArea}/ALF/${entityName}/add`,
            headers: {
                'x-api-key': this.apiKey,
                'Content-Type': 'application/json',
            }
        }, entityValue);
    }

    async getEntity(entityName: string): Promise<any> {
        return await CloudAdapter.createRequest({
            method: 'post', host: 'api.portal.dynamicsmobile.com', path: `/livelink/entity/${this.appArea}/ALF/${entityName}/query`,
            headers: {
                'x-api-key': this.apiKey,
                'Content-Type': 'application/json',
            },
        }, {});
    }
    async logRequest(data: string) {
        await this.addEntity('RequestLog', data);
    }
}


