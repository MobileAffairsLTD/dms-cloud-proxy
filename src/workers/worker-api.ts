import { JsxEmit } from "typescript";
import { backendAdapterFactory } from "../adapters/BackendAdapterFactory";
import { Configuration } from "../application/configuration";

export async function pollAllERPSyncLog(): Promise<void> {
    try {
        const syncLogEntityName = 'crSyncLogEntries';
        const slFieldStatus = 'status';
        const slFieldEntryNo = 'entryNo';
        const appArea = 'BIOTDEV';
        const company = 'BIOTRADE_COSM';
        const configuration = Configuration.load();
        const adapter = backendAdapterFactory(appArea, configuration);
        //const pendingPullPacketsFilter= "status eq 'Pending'";
        const pendingPullPacketsFilter = '';
        const recs = await adapter.executeGet(company, syncLogEntityName, pendingPullPacketsFilter, '', 100, 0, null);
        
        for(let i=0;i<recs.length;i++){
            const syncLogRecord = recs[i];
            console.log(`Processing pull synclog #${syncLogRecord[slFieldEntryNo]} `);
            syncLogRecord[slFieldStatus] = 'Success';    
                
            await adapter.executeUpdate(company,syncLogEntityName,syncLogRecord[slFieldEntryNo],syncLogRecord)
        }

        // packetType: Data
        // directopm: Pull
        // company
        // deviceSetupCode
        // entryNo
        // status
        //path
        
        console.log('synclog ', recs);
    }
    catch (err) {
        console.error(err);
    }
    return;
}