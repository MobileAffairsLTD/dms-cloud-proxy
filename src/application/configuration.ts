
import * as  fs from "fs";
import { config } from "node:process";
import * as  path from "path";

const configPath = path.resolve('./config.json');

//backend types

export const betBC = 'd365bc';
export const betD365FO = 'd365fo';
export const betNavSql = 'navsql'

//backend auth types
export const beautNTLM = 'NTLM';

const defaultSleepInterval = 10000; //sleep interval in milliseconds between hits


export interface BackendConfigurationObject {

    type: typeof betBC | typeof betD365FO | typeof betNavSql;
    authType: typeof beautNTLM;
    host: string;
    port: number;
    protocol: string;
    domain: string;
    workstation: string;
    path: string;
    userName: string;
    password: string;   
}

export interface AppAreaConfigurationObject {
    apiKey: string;
    settings: { [name: string]: any };
    backend: BackendConfigurationObject;
    defaultCompany: string;
}

export interface ConfigurationObject {
    slSyncLogEntityName: string;
    slFieldEntryNo: string;
    slFieldStatus: string;

    sleepInterval: number;
    
    localCloudPackets: string;
    
    port: number;
    ssl: boolean;
    apiKey: string;
    appArea: Record<string, AppAreaConfigurationObject>;
}

export class Configuration {

    static load(): ConfigurationObject {
        if (!fs.existsSync(configPath)) {
            console.log(`${configPath} does not exists. Terminating...`);
            process.exit(1)
        }
        const configJson = fs.readFileSync(configPath, 'utf8');

        try {
            const configuration: ConfigurationObject = JSON.parse(configJson);

            //handle sleep interval
            if (!isFinite(configuration.sleepInterval) || isNaN(configuration.sleepInterval)) {
                configuration.sleepInterval = defaultSleepInterval;
            }
            if (configuration.sleepInterval < defaultSleepInterval) {
                configuration.sleepInterval = defaultSleepInterval;
            }

            //handle local packets path
            if (!configuration.localCloudPackets) {
                configuration.localCloudPackets = './localpackets';
            }
            if (!fs.existsSync(configuration.localCloudPackets)) {
                console.log(`Creating local cloud packets folder: ${configuration.localCloudPackets}`);
                fs.mkdirSync(configuration.localCloudPackets);
            }

            

            if (!configuration.slSyncLogEntityName) {
                configuration.slSyncLogEntityName = 'crSyncLogEntries';
            }

            if (!configuration.slFieldStatus) {
                configuration.slFieldStatus = 'status';
            }

            if (!configuration.slFieldEntryNo) {
                configuration.slFieldEntryNo = 'entryNo';
            }

            //appareas validation

            const appAreaList = Object.getOwnPropertyNames(configuration.appArea);
            appAreaList.forEach((appArea: string ) => {
                if(!configuration.appArea[appArea].defaultCompany){
                    throw new Error(`AppArea ${appArea}.defaultCompany prop is missing!`);
                }
                
                if(!configuration.appArea[appArea].apiKey){
                    throw new Error(`AppArea ${appArea}.apiKey prop is missing!`);
                } 

                
                if(!configuration.appArea[appArea].backend){
                    throw new Error(`AppArea ${appArea}.backend prop is missing!`);
                } 

            });
            return configuration;
        }
        catch (err) {
            console.error(`Invalid ${configPath}: ${err}`);
            process.exit(1)
        }



    }


    static save(cfg: ConfigurationObject): void {
        try {
            if (fs.existsSync(configPath)) {
                fs.unlinkSync(configPath)
            }
            fs.writeFileSync(configPath, JSON.stringify(cfg), 'utf8');
        }
        catch (err) {
            console.log(`Unable to save config file to ${configPath}`, err);
            throw err;
        }

    }
}