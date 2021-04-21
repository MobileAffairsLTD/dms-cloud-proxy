/**
 *  Implements tools to be used for logging via Lambda functions
 *  The events are pushed into sqs and later read from special lambda and inserted into the
 *  specified apparea database
 */

const moment = require('moment')
import * as fs from 'fs';
//import { Client as ElasticSearchClient } from '@elastic/elasticsearch';

/*
 
 - go to kibana/settings/Dev 
 - execute existing index:  DELETE dms
 - execute the following query to create the dms index
 - wait for records to be pushed into the index
 - create index pattern and change the onDate and systemDate formats
 
  PUT dms
{
  "mappings": {
    "properties": {
      "onDate": {
        "type":   "date",
        "format": "epoch_millis"
      },
      "systemDate": {
        "type":   "date",
        "format": "epoch_millis"
      }
    }
  }
}
 
 
 */

type Event = {
    level?: number;
    source: string;
    operation: string;
    details: string;
    userName?: string;
    appArea?: string;
    onDate?: Date;
    appCode?: string;
    metricValue?: number;
};

export class EventLog {

    public static logEntries: Array<any> = [];


    private static logEvent(_evt: Event): void {
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
            if ((_evt.details as Error).message) {
                _evt.details = JSON.stringify({
                    name: (_evt.details as Error).name,
                    message: (_evt.details as Error).message,
                    stack: (_evt.details as Error).stack
                });
            }
            else {
                _evt.details = JSON.stringify(_evt.details);
            }
        }

        if (_evt.details.length > 1000) _evt.details = _evt.details.substring(0, 999);
        if (_evt.operation.length > 300) _evt.operation = _evt.operation.substring(0, 299);
        if (_evt.source.length > 50) _evt.source = _evt.source.substring(0, 49);

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


    private static flushEvents(force?: boolean): void {
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

    static logError(evt: Event): void {
        if (typeof evt == "object") evt.level = 0;
        return EventLog.logEvent(evt);
    }

    static logWarn(evt: Event): void {
        if (typeof evt == "object") evt.level = 1;
        return EventLog.logEvent(evt);
    }

    static logInfo(evt: Event): void {
        if (typeof evt == "object") evt.level = 2;
        return EventLog.logEvent(evt);
    }

    static logInfoStr(evtMsg: string): void {
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
        }
        EventLog.logInfo(evt);
    }
};


async function flushToCloud(): Promise<void> {
    const _body: Array<any> = [];
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
}
