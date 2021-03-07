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
var ms_business_central_adapter_1 = require("../erp-adapters/ms-business-central-adapter");
var LiveLinkEntityController = /** @class */ (function (_super) {
    __extends(LiveLinkEntityController, _super);
    function LiveLinkEntityController(configuraiton) {
        var _this = _super.call(this, configuraiton) || this;
        _this.get = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var entityName, client, result, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        entityName = req.params.entity;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        client = new ms_business_central_adapter_1.DynamicsBusinessCentralClient('NTLM', 'http', 'maisso04.dynamicsmobile.isystems.bg', 7947, 'INT_NUCR/ODataV4', 'e.kerimbov', '#Ker1mbov001', 'dynamicsmobile.isystems.bg', 'dynamicsmobile.isystems.bg');
                        return [4 /*yield*/, client.executeGet('27INTERION', 'DMSalesHeader', '', '', 1000, 0)];
                    case 2:
                        result = _a.sent();
                        this.returnResponseSucces(res, { message: result });
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        this.returnResponseError(res, 400, { message: err_1 });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        _this.create = function (req, res) {
            _this.returnResponseSucces(res, { message: 'create entity' });
        };
        _this.update = function (req, res) {
            _this.returnResponseSucces(res, { message: 'update entity' });
        };
        _this.delete = function (req, res) {
            _this.returnResponseSucces(res, { message: 'delete entity' });
        };
        _this.execCommand = function (req, res) {
            _this.returnResponseSucces(res, { message: 'exec cmd' });
        };
        return _this;
    }
    return LiveLinkEntityController;
}(api_controller_base_1.ApiControlerBase));
exports.LiveLinkEntityController = LiveLinkEntityController;
//# sourceMappingURL=livelink-entity-create.js.map