import { exec } from 'node:child_process';
import * as threading from 'worker_threads';
import { pollAllERPSyncLog } from './workers/worker-api';

let active = true;


console.log(`Running with DMS workers`);

let promise: Promise<void> = null;
let resolved: boolean = true;

async function execute() {

  while (active) {

      await new Promise(async (resolve, reject) => setTimeout(async function () {                
        await pollAllERPSyncLog();
        resolve(0);
      }, 2000)).then(() => {
        console.log('ping');
      });
    }
}


execute();


