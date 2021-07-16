import { isFunctionTypeNode } from 'typescript';
import { Configuration } from '../application/configuration';
import { sendLocalPullPacketsToCloud, sendLocalPushPacketsToERP } from './worker-api';
import { downloadPendingCloudSyncLog, pollPendingERPSyncLog } from './worker-api';
import * as fs from 'fs';


let active = true;


export class DmsWorker {

    async execute(options: { cloudPacketDownload: boolean, cloudBigFileDownload: boolean, uploadERPPacketsToCloud: boolean, downloadERPPackets: boolean, sendCloudPacketsToERP: boolean; }) {


        const configuration = Configuration.load();
        


        console.log(`DMS Agent Worker started ${(new Date()).toISOString()}`);
        while (active) {

            await new Promise(async (resolve, reject) => setTimeout(async function () {
                //obtain apparea list from the configuration file
                const appAreaList = Object.getOwnPropertyNames(configuration.appArea);
                
                //work with every apparea from the list
                for (let i = 0; i < appAreaList.length; i++) {
                    
                    const appArea = appAreaList[i];
                    
                    //download big files from cloud
                    if (options.cloudBigFileDownload) {
                        await downloadPendingCloudSyncLog(appArea, configuration, 'image');
                    }

                    //download sync packets from cloud
                    if (options.cloudPacketDownload) {
                        await downloadPendingCloudSyncLog(appArea, configuration,'data');
                    }

                    //send downloaded packets to ERP
                    if (options.sendCloudPacketsToERP) {
                        await sendLocalPushPacketsToERP(appArea, configuration);
                    }

                    //poll for pending ERP packets
                    if (options.downloadERPPackets) {
                        await pollPendingERPSyncLog(appArea, configuration);
                    }
                    //send ERP packets to cloud
                    if (options.uploadERPPacketsToCloud) {
                        await sendLocalPullPacketsToCloud(appArea, configuration);
                    }
                }
                resolve(0);
            }, configuration.sleepInterval)).then(() => {
                //...
            });
        }
    }

}


