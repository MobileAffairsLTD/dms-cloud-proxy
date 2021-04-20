"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ResponseBuilder = /** @class */ (function () {
    function ResponseBuilder(data) {
        if (data === void 0) { data = null; }
        this.data = data;
        this.success = true;
        this.message = '';
        return this;
    }
    ResponseBuilder.prototype.err = function (message, errors) {
        if (message === void 0) { message = ''; }
        if (errors === void 0) { errors = null; }
        this.success = false;
        this.errors = errors;
        this.setMessage(message);
        return this;
    };
    ResponseBuilder.prototype.setMessage = function (message) {
        this.message = message;
        return this;
    };
    ResponseBuilder.prototype.setMeta = function (meta) {
        this.meta = meta;
        return this;
    };
    ResponseBuilder.prototype.toJSON = function () {
        var res = {};
        for (var _i = 0, _a = Object.entries(this); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            if (value !== undefined && value !== null) {
                res[key] = value;
            }
        }
        return res;
    };
    return ResponseBuilder;
}());
exports.ResponseBuilder = ResponseBuilder;
//# sourceMappingURL=response.builder.js.map