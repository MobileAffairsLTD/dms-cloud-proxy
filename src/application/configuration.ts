
import * as  fs from "fs";
import * as  path from "path";

const configPath = path.resolve('./config.json');

//backend types

export const betBC = 'd365bc';
export const betD365FO = 'd365fo';
export const betNavSql = 'navsql'

//backend auth types
export const beautNTLM = 'NTLM';

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
    settings: {[name:string]: any};
    backend: BackendConfigurationObject;
}

export interface ConfigurationObject {
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
            return JSON.parse(configJson);
        }
        catch (err) {
            console.log(`${configPath} has invalid json format. Terminating...`);
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