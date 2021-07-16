"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var worker_core_1 = require("./workers/worker-core");
var worker = new worker_core_1.DmsWorker();
worker.execute({
    cloudBigFileDownload: true,
    cloudPacketDownload: false,
    downloadERPPackets: false,
    sendCloudPacketsToERP: false,
    uploadERPPacketsToCloud: false
});
//# sourceMappingURL=worker-cloudpackets.js.map