import { exec } from 'node:child_process';
import { DmsWorker } from './workers/worker-core';

 const worker = new DmsWorker();
 worker.execute({
   cloudBigFileDownload: false,
   cloudPacketDownload: false,
   downloadERPPackets: true,
   sendCloudPacketsToERP: true,
   uploadERPPacketsToCloud: true
 });

