"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var configPath = path.resolve('./config.json');
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
            return JSON.parse(configJson);
        }
        catch (err) {
            console.log(configPath + " has invalid json format. Terminating...");
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