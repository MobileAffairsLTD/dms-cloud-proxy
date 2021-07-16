import { backendAdapterFactory } from "../adapters/BackendAdapterFactory";
import { ConfigurationObject } from "../application/configuration";
import { CloudPacket, DmsCloudClient } from "./dms-cloud-api";
import * as fs from 'fs';
import * as path from 'path'

export async function pollPendingERPSyncLog(appArea: string, configuration: ConfigurationObject): Promise<void> {
    try {
        const adapter = backendAdapterFactory(appArea, configuration);
        //const pendingPullPacketsFilter= "status eq 'Pending'";
        const pendingPullPacketsFilter = '';
        const recs = await adapter.executeGet(configuration.appArea[appArea].defaultCompany, configuration.slSyncLogEntityName, pendingPullPacketsFilter, '', 100, 0, null);

        for (let i = 0; i < recs.length; i++) {
            const syncLogRecord = recs[i];
            console.log(`Processing pull synclog #${syncLogRecord[configuration.slFieldEntryNo]} `);
            syncLogRecord[configuration.slFieldStatus] = 'Success';

            await adapter.executeUpdate(configuration.appArea[appArea].defaultCompany, configuration.slSyncLogEntityName, syncLogRecord[configuration.slFieldEntryNo], syncLogRecord)
        }

        // packetType: Data
        // directopm: Pull
        // company
        // deviceSetupCode
        // entryNo
        // status
        //path
    }
    catch (err) {
        console.error(`${appArea}:: ERROR! Unable to download ERP packets: ${err}`);
    }
}



export async function downloadPendingCloudSyncLog(appArea: string, configuration: ConfigurationObject, type: 'image' | 'data'): Promise<void> {
    try {


        const cloudClient = new DmsCloudClient(configuration);
        console.log(`${appArea}:: Obtianing list of pending cloud packets..`);
        const pendindCloudPackets = await cloudClient.getPendingPullPacketsList(appArea, type);
        console.log(`${appArea}:: ${pendindCloudPackets.length} pending cloud packet obtained`);

        const successPackets = [];
        for (let i = 0; i < pendindCloudPackets.length; i++) {
            const cloudPacket = pendindCloudPackets[i];
            if (cloudPacket.packetType == 'image') {
                //image processing
                console.log(`${appArea}:: Downloading cloud image:  ${cloudPacket.url}`);
                await cloudClient.downloadImage(cloudPacket, configuration.localCloudPackets);
                successPackets.push(cloudPacket);
            }
            else {
                //regular packet processing
                try {
                    console.log(`${appArea}:: Downloading cloud packet:  ${cloudPacket.url}`);
                    await cloudClient.downloadPacket(cloudPacket, configuration.localCloudPackets);
                    successPackets.push(cloudPacket);
                }
                catch (err) {
                    console.error(`${appArea}:: Cloud packet download error ${cloudPacket.url} : ${err}`);
                }
            }


        }

        //mark packets as processed in the cloud 
        for (let i = 0; i < successPackets.length; i++) {

            //successPackets[i]
        }

        // packetType: Data
        // directopm: Pull
        // company
        // deviceSetupCode
        // entryNo
        // status
        //path


    }
    catch (err) {
        console.error(`${appArea}:: ERROR! Unable to download cloud packets: ${err}`);
    }
}



export async function sendLocalPushPacketsToERP(appArea: string, configuration: ConfigurationObject) {

    const appAreaFolderPath = path.join(configuration.localCloudPackets, appArea);
    if (!fs.existsSync(appAreaFolderPath))
        return;
    const cloudFiles = fs.readdirSync(appAreaFolderPath);
    const erpAgent = backendAdapterFactory(appArea, configuration);
    for (let i = 0; i < cloudFiles.length; i++) {
        try {
            const fullCloudFilePath = path.join(this.configuration.localCloudPackets, appArea, cloudFiles[i]);
            const fullMetaFilePath = path.join(this.configuration.localCloudPackets, appArea, cloudFiles[i] + '.meta');

            //check if the cloud packet exists locally
            if (!fs.existsSync(fullCloudFilePath)) {
                throw new Error(`Local cloud file ${fullCloudFilePath} does not exists!`);
            }

            //if the meta file does not exists, 
            //we will create it artifically
            //it may happen when the cloud packets are manually
            //created in the local folder   
            if (!fs.existsSync(fullMetaFilePath)) {                                
                let cloudPacketMeta: CloudPacket = {
                    appArea: appArea,
                    appCode: '',
                    companyId:  this.configuration.appArea[appArea].defaultCompany,
                    id: '',
                    onDate: (new Date()).toISOString(),
                    packetType: 'data',
                    receiptHandle: '',
                    size: 0,
                    url: '',
                    userName: 'unknown'
                }
                const tokens  =  fullCloudFilePath.split('.');
                if(tokens.length>2){
                    cloudPacketMeta.userName =  tokens[0]; 
                }
                fs.writeFileSync(fullMetaFilePath, JSON.stringify(cloudPacketMeta),'utf8');

            }
            
            await erpAgent.postToSyncLog(appArea, fullCloudFilePath, fullMetaFilePath);
        } catch (err) {
            console.error(`${appArea}:: ERROR! Unable to send cloud packets to ERP: ${err}`);
        }
    }
}


export async function sendLocalPullPacketsToCloud(appArea: string, configuration: ConfigurationObject) {

}
