var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var https = require('https');
export class AppAreaAdapter {
    static createRequest(options) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
}
//# sourceMappingURL=apparea-adapter.js.map