"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.backendAdapterFactory = void 0;
var configuration_1 = require("../application/configuration");
var ms_business_central_adapter_1 = require("./ms-business-central-adapter");
var navSql_adapter_1 = require("./navSql-adapter");
function backendAdapterFactory(appArea, configuration) {
    var appAreaConfig = configuration.appArea[appArea];
    if (!appAreaConfig) {
        throw "Application area '" + appArea + "' does not have proper configuration!";
    }
    var client = null;
    switch (appAreaConfig.backend.type) {
        case configuration_1.betBC:
            client = new ms_business_central_adapter_1.DynamicsBusinessCentralClient(appAreaConfig.backend.authType, appAreaConfig.backend.protocol, appAreaConfig.backend.host, appAreaConfig.backend.port, appAreaConfig.backend.path, appAreaConfig.backend.userName, appAreaConfig.backend.password, appAreaConfig.backend.domain, appAreaConfig.backend.workstation, configuration);
            break;
        case configuration_1.betNavSql:
        case configuration_1.betBC:
            client = new navSql_adapter_1.DynamicsNAVSQLBackendAdapter(appAreaConfig.backend.authType, appAreaConfig.backend.protocol, appAreaConfig.backend.host, appAreaConfig.backend.port, appAreaConfig.backend.path, appAreaConfig.backend.userName, appAreaConfig.backend.password, appAreaConfig.backend.domain, appAreaConfig.backend.workstation, configuration);
            break;
            ;
        case configuration_1.betD365FO: throw "betD365FO is not supported yet";
        default: throw "Unknown livelink  backendtype '" + appAreaConfig.settings.backend.type + "' for apparea '" + appArea + "'";
    }
    return client;
}
exports.backendAdapterFactory = backendAdapterFactory;
//# sourceMappingURL=BackendAdapterFactory.js.map