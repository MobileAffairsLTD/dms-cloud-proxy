"use strict";
/**
 *  Implements tools to be used for logging via Lambda functions
 *  The events are pushed into sqs and later read from special lambda and inserted into the
 *  specified apparea database
 */
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require('moment');
const fs = require("fs");
const elasticsearch_1 = require("@elastic/elasticsearch");
class EventLog {
    static logEvent(_evt) {
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
        const _userName = _evt.userName ? _evt.userName : process.env.dms_userName;
        const _appArea = _evt.appArea ? _evt.appArea : process.env.dms_appArea;
        if (!_userName) {
            throw new Error("Make sure you have activated dms.userName option in lambda shield or provided evt.userName arg");
        }
        if (!_appArea) {
            throw new Error("Make sure you have activated dms.appArea option in lambda shield or provided evt.userName arg");
        }
        const event = {
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
    }
    static flushEvents(force) {
        flushToCloud().then(() => {
            if (EventLog.logEntries.length > 100 || force) {
                const rootFolder = './logs';
                if (fs.existsSync(rootFolder)) {
                    fs.mkdirSync(rootFolder);
                }
                const logFilePath = `${rootFolder}/dms-logs${(new Date()).getTime()}.txt`;
                fs.writeFileSync(logFilePath, JSON.stringify(EventLog.logEntries), 'utf8');
                EventLog.logEntries = [];
            }
        });
    }
    static logError(evt) {
        if (typeof evt == "object")
            evt.level = 0;
        return EventLog.logEvent(evt);
    }
    static logWarn(evt) {
        if (typeof evt == "object")
            evt.level = 1;
        return EventLog.logEvent(evt);
    }
    static logInfo(evt) {
        if (typeof evt == "object")
            evt.level = 2;
        return EventLog.logEvent(evt);
    }
    static logInfoStr(evtMsg) {
        const evt = {
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
    }
}
exports.EventLog = EventLog;
EventLog.logEntries = [];
;
async function flushToCloud() {
    const _body = [];
    try {
        if (EventLog.logEntries.length > 0) {
            const client = new elasticsearch_1.Client({ auth: { username: 'dms-api', password: 'ABVabv123@#dmsapi202101' }, node: 'https://search-dms-eventlog-c5z66rz7wlq525ywntgyzeomnm.us-east-1.es.amazonaws.com' });
            EventLog.logEntries.forEach(r => {
                _body.push({ create: { _index: 'dms' } });
                _body.push(r);
            });
            const { body: bulkResponse } = await client.bulk({ body: _body });
            console.log('ES repsonse: ', bulkResponse);
            if (bulkResponse.errors) {
                const erroredDocuments = [];
                // The items array has the same order of the dataset we just indexed.
                // The presence of the `error` key indicates that the operation
                // that we did for the document has failed.
                bulkResponse.items.forEach((action, i) => {
                    const operation = Object.keys(action)[0];
                    if (action[operation].error) {
                        erroredDocuments.push({
                            // If the status is 429 it means that you can retry the document,
                            // otherwise it's very likely a mapping error, and you should
                            // fix the document before to try it again.
                            status: action[operation].status,
                            error: action[operation].error,
                            operation: EventLog.logEntries[i * 2],
                            document: EventLog.logEntries[i * 2 + 1]
                        });
                    }
                });
                console.log(erroredDocuments);
                throw erroredDocuments[0].toString();
            }
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
}
//# sourceMappingURL=event-log.js.map