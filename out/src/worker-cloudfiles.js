"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var worker_core_1 = require("./workers/worker-core");
var worker = new worker_core_1.DmsWorker();
worker.execute({
    cloudBigFileDownload: false,
    cloudPacketDownload: true,
    downloadERPPackets: false,
    sendCloudPacketsToERP: false,
    uploadERPPacketsToCloud: false
});
//# sourceMappingURL=worker-cloudfiles.js.map