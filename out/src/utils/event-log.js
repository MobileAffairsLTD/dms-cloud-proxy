"use strict";
/**
 *  Implements tools to be used for logging via Lambda functions
 *  The events are pushed into sqs and later read from special lambda and inserted into the
 *  specified apparea database
 */
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
exports.EventLog = void 0;
var moment = require('moment');
var fs = require("fs");
var EventLog = /** @class */ (function () {
    function EventLog() {
    }
    EventLog.logEvent = function (_evt) {
        if (!_evt) {
            throw new Error("logEvent evt argument is required");
        }
        if (_evt.level == null) {
            throw new Error("logEvent evt.level argument is required");
        }
        if (_evt.source == null) {
            throw new Error("logEvent evt.source argument is required");
        }
        if (_evt.operation == null) {
            throw new Error("logEvent evt.operation argument is required");
        }
        if (_evt.details == null) {
            throw new Error("logEvent evt.details argument is required");
        }
        if (typeof _evt.details == "object") {
            if (_evt.details.message) {
                _evt.details = JSON.stringify({
                    name: _evt.details.name,
                    message: _evt.details.message,
                    stack: _evt.details.stack
                });
            }
            else {
                _evt.details = JSON.stringify(_evt.details);
            }
        }
        if (_evt.details.length > 1000)
            _evt.details = _evt.details.substring(0, 999);
        if (_evt.operation.length > 300)
            _evt.operation = _evt.operation.substring(0, 299);
        if (_evt.source.length > 50)
            _evt.source = _evt.source.substring(0, 49);
        var _userName = _evt.userName ? _evt.userName : process.env.dms_userName;
        var _appArea = _evt.appArea ? _evt.appArea : process.env.dms_appArea;
        if (!_userName) {
            throw new Error("Make sure you have activated dms.userName option in lambda shield or provided evt.userName arg");
        }
        if (!_appArea) {
            throw new Error("Make sure you have activated dms.appArea option in lambda shield or provided evt.userName arg");
        }
        var event = {
            source: _evt.source,
            operation: _evt.operation,
            details: _evt.details,
            level: _evt.level,
            originType: 'AGENT',
            appCode: _evt.appCode,
            appArea: _appArea,
            userName: _userName,
            metricValue: _evt.metricValue,
            onDate: _evt.onDate ? (moment(_evt.onDate).toDate().getTime()) : ((new Date()).getTime())
        };
        EventLog.logEntries.push(event);
        EventLog.flushEvents();
    };
    EventLog.flushEvents = function (force) {
        flushToCloud().then(function () {
            if (EventLog.logEntries.length > 100 || force) {
                var rootFolder = './logs';
                if (fs.existsSync(rootFolder)) {
                    fs.mkdirSync(rootFolder);
                }
                var logFilePath = rootFolder + "/dms-logs" + (new Date()).getTime() + ".txt";
                fs.writeFileSync(logFilePath, JSON.stringify(EventLog.logEntries), 'utf8');
                EventLog.logEntries = [];
            }
        });
    };
    EventLog.logError = function (evt) {
        if (typeof evt == "object")
            evt.level = 0;
        return EventLog.logEvent(evt);
    };
    EventLog.logWarn = function (evt) {
        if (typeof evt == "object")
            evt.level = 1;
        return EventLog.logEvent(evt);
    };
    EventLog.logInfo = function (evt) {
        if (typeof evt == "object")
            evt.level = 2;
        return EventLog.logEvent(evt);
    };
    EventLog.logInfoStr = function (evtMsg) {
        var evt = {
            level: 1,
            source: 'AGENT',
            operation: evtMsg,
            details: '',
            userName: 'system',
            appArea: 'global',
            onDate: new Date(),
            appCode: 'AGENT',
            metricValue: 0
        };
        EventLog.logInfo(evt);
    };
    EventLog.logEntries = [];
    return EventLog;
}());
exports.EventLog = EventLog;
;
function flushToCloud() {
    return __awaiter(this, void 0, void 0, function () {
        var _body;
        return __generator(this, function (_a) {
            _body = [];
            try {
                if (EventLog.logEntries.length > 0) {
                    // const client = new ElasticSearchClient({ auth: { username: 'dms-api', password: 'ABVabv123@#dmsapi202101' }, node: 'https://search-dms-eventlog-c5z66rz7wlq525ywntgyzeomnm.us-east-1.es.amazonaws.com' })
                    // EventLog.logEntries.forEach(r => {
                    //     _body.push({ create: { _index: 'dms' } });
                    //     _body.push(r);
                    // })
                    // const { body: bulkResponse } = await client.bulk({ body: _body as any }) as any;
                    // console.log('ES repsonse: ', bulkResponse);
                    // if (bulkResponse.errors) {
                    //     const erroredDocuments: Array<any> = [];
                    //     // The items array has the same order of the dataset we just indexed.
                    //     // The presence of the `error` key indicates that the operation
                    //     // that we did for the document has failed.
                    //     bulkResponse.items.forEach((action: any, i) => {
                    //         const operation = Object.keys(action)[0]
                    //         if (action[operation].error) {
                    //             erroredDocuments.push({
                    //                 // If the status is 429 it means that you can retry the document,
                    //                 // otherwise it's very likely a mapping error, and you should
                    //                 // fix the document before to try it again.
                    //                 status: action[operation].status,
                    //                 error: action[operation].error,
                    //                 operation: EventLog.logEntries[i * 2],
                    //                 document: EventLog.logEntries[i * 2 + 1]
                    //             })
                    //         }
                    //     })
                    //     console.log(erroredDocuments)
                    //     throw erroredDocuments[0].toString();
                    // }
                }
                // if (appArea.name != 'delita') {
                //     await entityModel.addEntityWithPromise("EventLog", appArea.records);
                // }
            }
            catch (err) {
                if (err) {
                    //         //we dont want to thow error as there might be large number of events
                    //         //to already non-existing area/database so the events will not be deleted from SQS
                    //         //which will flood the event processing
                    console.log("ERROR: Unable to insert event: ", err);
                }
                //     // And despite the above comment, the code before refactoring still did cb(err) here... so we are keeping that
                throw err;
            }
            return [2 /*return*/];
        });
    });
}
//# sourceMappingURL=event-log.js.map