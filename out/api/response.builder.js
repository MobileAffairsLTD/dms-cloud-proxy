"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResponseBuilder {
    constructor(data = null) {
        this.data = data;
        this.success = true;
        this.message = '';
        return this;
    }
    err(message = '', errors = null) {
        this.success = false;
        this.errors = errors;
        this.setMessage(message);
        return this;
    }
    setMessage(message) {
        this.message = message;
        return this;
    }
    setMeta(meta) {
        this.meta = meta;
        return this;
    }
    toJSON() {
        const res = {};
        for (const [key, value] of Object.entries(this)) {
            if (value !== undefined && value !== null) {
                res[key] = value;
            }
        }
        return res;
    }
}
exports.ResponseBuilder = ResponseBuilder;
//# sourceMappingURL=response.builder.js.map