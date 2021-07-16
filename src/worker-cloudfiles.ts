import { exec } from 'node:child_process';
import { DmsWorker } from './workers/worker-core';

 const worker = new DmsWorker();
 worker.execute({
   cloudBigFileDownload: false,
   cloudPacketDownload: true,
   downloadERPPackets: false,
   sendCloudPacketsToERP: false,
   uploadERPPacketsToCloud: false
 });

