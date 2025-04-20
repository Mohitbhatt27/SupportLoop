"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const genericError_1 = __importDefault(require("./genericError"));
class UnauthorisedError extends genericError_1.default {
    constructor(message) {
        const errorMessage = message
            ? message
            : "Invalid login credentials, please try again with correct credentials !";
        super(http_status_codes_1.StatusCodes.UNAUTHORIZED, http_status_codes_1.ReasonPhrases.UNAUTHORIZED, errorMessage, "UnauthorisedError");
    }
}
exports.default = UnauthorisedError;
