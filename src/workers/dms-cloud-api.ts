import { ConfigurationObject } from "../application/configuration";
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import * as URL from "url";

const basicCloudAPIUrl = 'api.portal.dynamicsmobile.com';

export type CloudPacket  = {
    id: string;
    packetType: 'image'|'data';
    companyId: string;
    appCode: string;
    userName: string;
    onDate: string; //"2021-07-14T09:42:19.382Z"
    receiptHandle: string;
    size: number;
    url: string;
    appArea:string;
}

export class DmsCloudClient {

    constructor(private configuration: ConfigurationObject){

    }

    getPendingPullPacketsList(appArea: string,type: 'image'|'data'): Promise<Array<CloudPacket>> {
        
        if(!this.configuration.appArea[appArea]){
            throw new Error(`AppArea ${appArea}  is not found in config.json`);
        }

        if(!this.configuration.appArea[appArea].apiKey){
            throw new Error(`AppArea ApiKey is not found  in config.json`);
        }

        return new Promise((resolve, reject) => {
            const options = {
                hostname: basicCloudAPIUrl,
                port: 443,
                path: `/mobile/erp/pull/${appArea}?format=json`,
                method: 'GET',
                headers: {
                    "x-api-key": this.configuration.appArea[appArea].apiKey
                }
            }
            if(type=='image'){
                //force downloading of big files/images only
                options.path+='&packetType=file';
            }
            let responseBody = '';
            const req = https.request(options, res => {
                res.on('data', d => {
                    responseBody += d;
                })

                res.on('end', function () {
                    if (res.statusCode != 200) {
                        const errMsg = `${res.statusCode}.${res.statusMessage ? res.statusMessage : 'General Error'}`;
                        reject(errMsg);
                    } else {
                        const packets = JSON.parse(responseBody); 
                        packets.forEach(p => {
                            p.appArea = appArea;
                        });
                        resolve(packets);
                    }
                });


            });
            req.on('error', error => {
                reject(error);
            });
            req.end()
        });
    }

    async downloadPacket(packet: CloudPacket, localFolderPath: string): Promise<any> {      
       
        const tempUrl:{url:string} = await new Promise((resolve, reject) => {
            const options = {
                hostname: basicCloudAPIUrl,
                port: 443,
                path: `/mobile/erp/pull/${packet.appArea}/link?path=${packet.url.replace("/json/","/xml/").replace('.json','.xml')}`,
                method: 'GET',
                headers: {
                    "x-api-key": this.configuration.appArea[packet.appArea].apiKey
                }
            }
            let responseBody = '';
            const req = https.request(options, res => {
                res.on('data', d => {
                    responseBody += d;
                })

                res.on('end', function () {
                    if (res.statusCode != 200) {
                        const errMsg = `${res.statusCode}.${res.statusMessage ? res.statusMessage : 'General Error'}`;
                        reject(errMsg);
                    } else {
                        resolve(JSON.parse(responseBody));
                    }
                });

            });
            req.on('error', error => {
                reject(error);
            });
            req.end()
        });

        const url = new URL.URL(tempUrl.url);


        const packetContent: string = await new Promise((resolve, reject) => {
            const options = {
                hostname:  url.hostname,
                port:  443,
                path: `${url.pathname}${url.search}`,
                method: 'GET'
            }
            let responseBody = '';
            const req = https.request(options, res => {
                res.on('data', d => {
                    responseBody += d;
                })

                res.on('end', function () {
                    if (res.statusCode != 200) {
                        const errMsg = `${res.statusCode}.${res.statusMessage ? res.statusMessage : 'General Error'}`;
                        reject(errMsg);
                    } else {
                        resolve(responseBody);
                    }
                });

            });
            req.on('error', error => {
                reject(error);
            });
            req.end()
        });

        if(!fs.existsSync(localFolderPath)){
            fs.mkdirSync(localFolderPath);            
        }

        if(!fs.existsSync(path.join(localFolderPath, packet.appArea))){
            fs.mkdirSync(path.join(localFolderPath, packet.appArea));            
        }
        fs.writeFileSync(path.join(localFolderPath, packet.appArea, `${packet.id}.xml`), packetContent);
        fs.writeFileSync(path.join(localFolderPath, packet.appArea, `${packet.id}.xml.meta`), JSON.stringify(packet));
    }

    async downloadImage(packet: CloudPacket, localFolderPath: string): Promise<any> {
``
        // if(!fs.existsSync(localFolderPath)){
        //     fs.mkdirSync(localFolderPath);
        // }
        // fs.writeFileSync(path.join(localFolderPath, cloudPacket['DMS_ROWID']), 'abcd...123');


    }
}