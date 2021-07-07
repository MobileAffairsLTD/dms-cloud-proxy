"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicsNAVSQLBackendAdapter = void 0;
var parser = require("fast-xml-parser").default;
var BackendAdapterBase_1 = require("./BackendAdapterBase");
var sql = require('mssql');
var DynamicsNAVSQLBackendAdapter = /** @class */ (function (_super) {
    __extends(DynamicsNAVSQLBackendAdapter, _super);
    function DynamicsNAVSQLBackendAdapter(authType, protocol, host, port, path, username, password, domain, workstation) {
        return _super.call(this, authType, protocol, host, port, path, username, password, domain, workstation) || this;
    }
    DynamicsNAVSQLBackendAdapter.prototype.executeGet = function (company, entityName, filter, sort, max, page, apply) {
        return __awaiter(this, void 0, void 0, function () {
            var maxRecs, where, orderby, result, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!entityName)
                            throw 'entityName parameter is required for NAV-SQL LiveLink';
                        if (!this.authType)
                            throw '"authType" role setting is required for NAV-SQL LiveLink';
                        if (!this.host)
                            throw '"host" role setting is required for NAV-SQL LiveLink';
                        if (!this.path)
                            throw '"path" role setting is required for NAV-SQL LiveLink';
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        maxRecs = '';
                        if (max) {
                            maxRecs = " top " + maxRecs + " ";
                        }
                        where = '';
                        if (filter) {
                            where = " WHERE " + filter + " ";
                        }
                        orderby = '';
                        if (sort) {
                            orderby = " ORDER BY " + sort + " ";
                        }
                        // make sure that any items are correctly URL encoded in the connection string
                        return [4 /*yield*/, sql.connect("Server=" + this.host + "," + this.port + "?" + this.port + ":'1433';Database=" + this.path + ";User Id=" + this.username + ";Password=" + this.password + ";Encrypt=false")];
                    case 2:
                        // make sure that any items are correctly URL encoded in the connection string
                        _a.sent();
                        return [4 /*yield*/, sql.query("SELECT " + maxRecs + " * FROM [" + (company ? company + '$' : '') + entityName + "] " + where + " " + orderby)];
                    case 3:
                        result = _a.sent();
                        if (result && result.recordsets && result.recordsets.length > 0) {
                            if (result.recordsets.length == 1)
                                return [2 /*return*/, JSON.stringify(result.recordsets[0])];
                            else
                                return [2 /*return*/, JSON.stringify(result.recordsets)];
                        }
                        else {
                            return [2 /*return*/, JSON.stringify([])];
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        throw err_1;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DynamicsNAVSQLBackendAdapter.prototype.executeCreate = function (company, entityName, body) {
        throw "create method is not supported for this adapter type";
    };
    DynamicsNAVSQLBackendAdapter.prototype.executeUpdate = function (company, entityName, pkValues, body) {
        throw "update method is not supported for this adapter type";
    };
    DynamicsNAVSQLBackendAdapter.prototype.executeDelete = function (company, entityName, pkValues, body) {
        throw "delete method is not supported for this adapter type";
    };
    DynamicsNAVSQLBackendAdapter.prototype.executeMetadata = function (company, entityName) {
        throw "metadata method is not supported for this adapter type";
    };
    return DynamicsNAVSQLBackendAdapter;
}(BackendAdapterBase_1.BackendAdapterBase));
exports.DynamicsNAVSQLBackendAdapter = DynamicsNAVSQLBackendAdapter;
//# sourceMappingURL=navSql-adapter.js.map