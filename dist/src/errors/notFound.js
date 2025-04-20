"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const genericError_1 = __importDefault(require("./genericError"));
class NotFoundError extends genericError_1.default {
    constructor(resourceName, property, propertyValue) {
        const errorMessage = `The resource: ${resourceName} with property ${property} : ${propertyValue} not found`;
        super(http_status_codes_1.StatusCodes.NOT_FOUND, http_status_codes_1.ReasonPhrases.NOT_FOUND, errorMessage, "NotFoundError");
    }
}
exports.default = NotFoundError;
