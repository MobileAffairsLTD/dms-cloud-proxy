import { AppAreaConfigurationObject, betBC, betD365FO, betNavSql, ConfigurationObject } from "../application/configuration";
import { BackendAdapterBase } from "./BackendAdapterBase";
import { DynamicsBusinessCentralClient } from "./ms-business-central-adapter";
import { DynamicsNAVSQLBackendAdapter } from "./navSql-adapter";

export function backendAdapterFactory(appArea: string, configuration: ConfigurationObject): BackendAdapterBase {

    const appAreaConfig = configuration.appArea[appArea];
    if(!appAreaConfig){
        throw `Application area '${appArea}' does not have proper configuration!`;
    }
    let client: BackendAdapterBase = null;
    switch (appAreaConfig.backend.type) {
        case betBC: client = new DynamicsBusinessCentralClient(
            appAreaConfig.backend.authType,
            appAreaConfig.backend.protocol,
            appAreaConfig.backend.host,
            appAreaConfig.backend.port,
            appAreaConfig.backend.path,
            appAreaConfig.backend.userName,
            appAreaConfig.backend.password,
            appAreaConfig.backend.domain,
            appAreaConfig.backend.workstation,
            configuration
        ); break;
        case betNavSql:   case betBC: client = new DynamicsNAVSQLBackendAdapter(
            appAreaConfig.backend.authType,
            appAreaConfig.backend.protocol,
            appAreaConfig.backend.host,
            appAreaConfig.backend.port,
            appAreaConfig.backend.path,
            appAreaConfig.backend.userName,
            appAreaConfig.backend.password,
            appAreaConfig.backend.domain,
            appAreaConfig.backend.workstation,
            configuration
        ); break;;
        case betD365FO: throw `betD365FO is not supported yet`;
        default: throw `Unknown livelink  backendtype '${appAreaConfig.settings.backend.type}' for apparea '${appArea}'`
    }
    return client;
}