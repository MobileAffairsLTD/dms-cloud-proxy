"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pollAllERPSyncLog = void 0;
var BackendAdapterFactory_1 = require("../adapters/BackendAdapterFactory");
var configuration_1 = require("../application/configuration");
function pollAllERPSyncLog() {
    return __awaiter(this, void 0, void 0, function () {
        var syncLogEntityName, slFieldStatus, slFieldEntryNo, appArea, company, configuration, adapter, pendingPullPacketsFilter, recs, i, syncLogRecord, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    syncLogEntityName = 'crSyncLogEntries';
                    slFieldStatus = 'status';
                    slFieldEntryNo = 'entryNo';
                    appArea = 'BIOTDEV';
                    company = 'BIOTRADE_COSM';
                    configuration = configuration_1.Configuration.load();
                    adapter = BackendAdapterFactory_1.backendAdapterFactory(appArea, configuration);
                    pendingPullPacketsFilter = '';
                    return [4 /*yield*/, adapter.executeGet(company, syncLogEntityName, pendingPullPacketsFilter, '', 100, 0, null)];
                case 1:
                    recs = _a.sent();
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < recs.length)) return [3 /*break*/, 5];
                    syncLogRecord = recs[i];
                    console.log("Processing pull synclog #" + syncLogRecord[slFieldEntryNo] + " ");
                    syncLogRecord[slFieldStatus] = 'Success';
                    return [4 /*yield*/, adapter.executeUpdate(company, syncLogEntityName, syncLogRecord[slFieldEntryNo], syncLogRecord)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5:
                    // packetType: Data
                    // directopm: Pull
                    // company
                    // deviceSetupCode
                    // entryNo
                    // status
                    //path
                    console.log('synclog ', recs);
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _a.sent();
                    console.error(err_1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.pollAllERPSyncLog = pollAllERPSyncLog;
//# sourceMappingURL=worker-api.js.map