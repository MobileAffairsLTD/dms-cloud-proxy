"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var https = require('https');
class AppAreaAdapter {
    static async createRequest(options) {
        return new Promise((resolve, reject) => {
            const callback = function (response) {
                var str = '';
                response.on('data', function (chunk) {
                    str += chunk;
                });
                response.on('end', function (err) {
                    if (this.statusCode != 200) {
                        if (str)
                            reject(str);
                        else
                            reject(this.statusMessage);
                    }
                    else {
                        resolve(str);
                    }
                });
            };
            const req = https.request(options, callback);
            req.on('error', function (err) {
                reject(err);
            });
            req.end();
        });
    }
}
exports.AppAreaAdapter = AppAreaAdapter;
//# sourceMappingURL=apparea-adapter.js.map