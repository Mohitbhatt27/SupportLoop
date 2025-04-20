"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GenericError extends Error {
    constructor(statusCode, reason, errorMessage, name) {
        super(errorMessage);
        this.statusCode = statusCode;
        this.reason = reason;
        this.name = name;
        this.errorMessage = errorMessage;
    }
}
exports.default = GenericError;
