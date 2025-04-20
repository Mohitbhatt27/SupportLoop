"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const genericError_1 = __importDefault(require("./genericError"));
class InternalServerError extends genericError_1.default {
    constructor() {
        const errorMessage = "Something went wrong, please try again later !";
        super(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR, errorMessage, "InternalServerError");
    }
}
exports.default = InternalServerError;
