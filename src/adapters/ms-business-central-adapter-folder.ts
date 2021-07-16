import * as httpntlm from '../libs/httpntlm/httpntlm';
const parser = require("fast-xml-parser").default;
import * as fs from 'fs';
import * as path from 'path';
import { BackendAdapterBase } from './BackendAdapterBase';
import { ConfigurationObject } from '../application/configuration';
import he from 'he';
import { CloudPacket } from '../workers/dms-cloud-api';

export class DynamicsBusinessCentralWithFolderClient extends BackendAdapterBase {

    public async validateConfiguration(appArea: string): Promise<void>{
        super.validateConfiguration(appArea);
       
        if(this.configuration.appArea[appArea].settings == undefined){        
            throw new Error(`${appArea}.settings property does not exists`);
        }

        if(!this.configuration.appArea[appArea].settings["erpSyncPacketFolder"]){
            throw new Error(`${appArea}.settings.erpSyncPacketFolder property does not exists`);
        }

        if(!fs.existsSync(this.configuration.appArea[appArea].settings["erpSyncPacketFolder"])){
            throw new Error(`${appArea}.settings.erpSyncPacketFolder property points to not existing folder path!`);
        }
    }


    //the method exchanges the packets with the ERP
    //via windows file folder
    public async postToSyncLog(appArea: string, fullCloudFilePath: string, cloudPacketMeta: CloudPacket): Promise<void> {
      
        const targetPacketPath = path.join(this.configuration.appArea[appArea].settings["erpSyncPacketFolder"], path.basename(fullCloudFilePath));
        

        //prepare BC packet
        const syncPacket = {
            //entryNo: 1
            entryTimeStamp: (new Date()).toISOString(),
            //errorDescription: ""
            path: '',                
            direction: "Push",
            packetType: "Data",
            priority: 0,
            status: "Pending",
            deviceSetupCode: cloudPacketMeta.userName,
            company: cloudPacketMeta.companyId
        }

        fs.copyFileSync(fullCloudFilePath, targetPacketPath);

        //send to erp
        await this.executeCreate(cloudPacketMeta.companyId, this.configuration.slSyncLogEntityName, syncPacket);
        
      
    }

}

