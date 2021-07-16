import { exec } from 'node:child_process';
import { DmsWorker } from './workers/worker-core';

 const worker = new DmsWorker();
 worker.execute({
   cloudBigFileDownload: true,
   cloudPacketDownload: false,
   downloadERPPackets: false,
   sendCloudPacketsToERP: false,
   uploadERPPacketsToCloud: false
 });

