"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
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
var api_controller_base_1 = require("./api-controller-base");
var fs = require("fs");
var path = require("path");
function deleteModule(moduleName) {
    var solvedName = require.resolve(moduleName), nodeModule = require.cache[solvedName];
    if (nodeModule) {
        for (var i = 0; i < nodeModule.children.length; i++) {
            var child = nodeModule.children[i];
            deleteModule(child.filename);
        }
        delete require.cache[solvedName];
    }
}
var ApplicationCommandController = /** @class */ (function (_super) {
    __extends(ApplicationCommandController, _super);
    function ApplicationCommandController(configuraiton) {
        var _this = _super.call(this, configuraiton) || this;
        _this.execute = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var appArea, appCode, commandName, modulePath, BackendService, be, serviceResponse, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        appArea = req.params.appArea;
                        appCode = req.params.appCode;
                        commandName = req.params.command;
                        console.log(appArea, appCode, commandName);
                        require('browser-env')(['window'], { url: 'http://localhost', storageQuota: 1000000, });
                        global.HTMLElement = window.HTMLElement;
                        global.document = window.document;
                        global.navigator = window.navigator;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        modulePath = path.resolve("./out/appArea/" + appArea + "/" + appCode + "/backendservice.js");
                        if (!fs.existsSync(modulePath)) {
                            throw new Error("BackendService module for " + appArea + "." + appCode + " does not exists!");
                        }
                        //TODO: check of the module was changed and delete it only if a change is there
                        deleteModule(modulePath);
                        BackendService = require(modulePath).default;
                        be = new BackendService();
                        return [4 /*yield*/, be.processEvent({
                                eventName: 'system:api:inbound', eventArguments: {
                                    appArea: appArea,
                                    appCode: appCode,
                                    commandName: commandName
                                }
                            })];
                    case 2:
                        serviceResponse = _a.sent();
                        this.returnResponseSucces(res, { message: serviceResponse });
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        console.log(err_1);
                        console.log(err_1.stack);
                        this.returnResponseError(res, 400, err_1.message ? err_1.message : err_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        return _this;
    }
    return ApplicationCommandController;
}(api_controller_base_1.ApiControlerBase));
exports.ApplicationCommandController = ApplicationCommandController;
//# sourceMappingURL=app-command-controller.js.map