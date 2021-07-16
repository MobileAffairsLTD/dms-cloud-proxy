import { DmsWorker } from './workers/worker-core';

 const worker = new DmsWorker();
 worker.execute({
   cloudBigFileDownload: true,
   cloudPacketDownload: true,
   downloadERPPackets: true,
   sendCloudPacketsToERP: true,
   uploadERPPacketsToCloud: true
 });

