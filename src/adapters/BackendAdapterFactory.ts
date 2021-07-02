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
    switch (appAreaConfig.settings.backend.type) {
        case betBC: client = new DynamicsBusinessCentralClient(
            appAreaConfig.settings.backend.authType,
            appAreaConfig.settings.backend.protocol,
            appAreaConfig.settings.backend.host,
            appAreaConfig.settings.backend.port,
            appAreaConfig.settings.backend.path,
            appAreaConfig.settings.backend.userName,
            appAreaConfig.settings.backend.password,
            appAreaConfig.settings.backend.domain,
            appAreaConfig.settings.backend.workstation
        ); break;
        case betNavSql:   case betBC: client = new DynamicsNAVSQLBackendAdapter(
            appAreaConfig.settings.backend.authType,
            appAreaConfig.settings.backend.protocol,
            appAreaConfig.settings.backend.host,
            appAreaConfig.settings.backend.port,
            appAreaConfig.settings.backend.path,
            appAreaConfig.settings.backend.userName,
            appAreaConfig.settings.backend.password,
            appAreaConfig.settings.backend.domain,
            appAreaConfig.settings.backend.workstation
        ); break;;
        case betD365FO: throw `betD365FO is not supported yet`;
        default: throw `Unknown livelink  backendtype '${appAreaConfig.settings.backend.type}' for apparea '${appArea}'`
    }
    return client;
}