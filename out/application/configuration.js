import * as fs from "fs";
import * as path from "path";
const configPath = path.resolve('./config.json');
export class Configuration {
    static load() {
        if (!fs.existsSync(configPath)) {
            console.log(`${configPath} does not exists. Terminating...`);
            process.exit(1);
        }
        const configJson = fs.readFileSync(configPath, 'utf8');
        try {
            return JSON.parse(configJson);
        }
        catch (err) {
            console.log(`${configPath} has invalid json format. Terminating...`);
            process.exit(1);
        }
    }
    static save(cfg) {
        try {
            if (fs.existsSync(configPath)) {
                fs.unlinkSync(configPath);
            }
            fs.writeFileSync(configPath, JSON.stringify(cfg), 'utf8');
        }
        catch (err) {
            console.log(`Unable to save config file to ${configPath}`, err);
            throw err;
        }
    }
}
//# sourceMappingURL=configuration.js.map