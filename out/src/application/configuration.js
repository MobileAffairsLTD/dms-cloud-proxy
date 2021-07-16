"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Configuration = exports.beautNTLM = exports.betNavSql = exports.betD365FO = exports.betBC = void 0;
var fs = require("fs");
var path = require("path");
var configPath = path.resolve('./config.json');
//backend types
exports.betBC = 'd365bc';
exports.betD365FO = 'd365fo';
exports.betNavSql = 'navsql';
//backend auth types
exports.beautNTLM = 'NTLM';
var defaultSleepInterval = 10000; //sleep interval in milliseconds between hits
var Configuration = /** @class */ (function () {
    function Configuration() {
    }
    Configuration.load = function () {
        if (!fs.existsSync(configPath)) {
            console.log(configPath + " does not exists. Terminating...");
            process.exit(1);
        }
        var configJson = fs.readFileSync(configPath, 'utf8');
        try {
            var configuration_1 = JSON.parse(configJson);
            //handle sleep interval
            if (!isFinite(configuration_1.sleepInterval) || isNaN(configuration_1.sleepInterval)) {
                configuration_1.sleepInterval = defaultSleepInterval;
            }
            if (configuration_1.sleepInterval < defaultSleepInterval) {
                configuration_1.sleepInterval = defaultSleepInterval;
            }
            //handle local packets path
            if (!configuration_1.localCloudPackets) {
                configuration_1.localCloudPackets = './localpackets';
            }
            if (!fs.existsSync(configuration_1.localCloudPackets)) {
                console.log("Creating local cloud packets folder: " + configuration_1.localCloudPackets);
                fs.mkdirSync(configuration_1.localCloudPackets);
            }
            if (!configuration_1.slSyncLogEntityName) {
                configuration_1.slSyncLogEntityName = 'crSyncLogEntries';
            }
            if (!configuration_1.slFieldStatus) {
                configuration_1.slFieldStatus = 'status';
            }
            if (!configuration_1.slFieldEntryNo) {
                configuration_1.slFieldEntryNo = 'entryNo';
            }
            //appareas validation
            var appAreaList = Object.getOwnPropertyNames(configuration_1.appArea);
            appAreaList.forEach(function (appArea) {
                if (!configuration_1.appArea[appArea].defaultCompany) {
                    throw new Error("AppArea " + appArea + ".defaultCompany prop is missing!");
                }
                if (!configuration_1.appArea[appArea].apiKey) {
                    throw new Error("AppArea " + appArea + ".apiKey prop is missing!");
                }
                if (!configuration_1.appArea[appArea].backend) {
                    throw new Error("AppArea " + appArea + ".backend prop is missing!");
                }
            });
            return configuration_1;
        }
        catch (err) {
            console.error("Invalid " + configPath + ": " + err);
            process.exit(1);
        }
    };
    Configuration.save = function (cfg) {
        try {
            if (fs.existsSync(configPath)) {
                fs.unlinkSync(configPath);
            }
            fs.writeFileSync(configPath, JSON.stringify(cfg), 'utf8');
        }
        catch (err) {
            console.log("Unable to save config file to " + configPath, err);
            throw err;
        }
    };
    return Configuration;
}());
exports.Configuration = Configuration;
//# sourceMappingURL=configuration.js.map