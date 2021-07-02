"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackendAdapterBase = void 0;
var BackendAdapterBase = /** @class */ (function () {
    function BackendAdapterBase(authType, protocol, host, port, path, username, password, domain, workstation) {
        this.authType = authType;
        this.protocol = protocol;
        this.host = host;
        this.port = port;
        this.path = path;
        this.username = username;
        this.password = password;
        this.domain = domain;
        this.workstation = workstation;
    }
    BackendAdapterBase.prototype.executeGet = function (company, entityName, filter, sort, max, page, apply) {
        return null;
    };
    BackendAdapterBase.prototype.executeCreate = function (company, entityName, body) {
        return null;
    };
    BackendAdapterBase.prototype.executeUpdate = function (company, entityName, pkValues, body) {
        return null;
    };
    BackendAdapterBase.prototype.executeDelete = function (company, entityName, pkValues, body) {
        return null;
    };
    BackendAdapterBase.prototype.executeMetadata = function (company, entityName) {
        return null;
    };
    return BackendAdapterBase;
}());
exports.BackendAdapterBase = BackendAdapterBase;
//# sourceMappingURL=BackendAdapterBase.js.map