"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInValidator = exports.createUserMiddleware = void 0;
const createUser_DTO_1 = __importDefault(require("../dtos/createUser_DTO"));
const class_validator_1 = require("class-validator");
const http_status_codes_1 = require("http-status-codes");
const badRequest_1 = __importDefault(require("../errors/badRequest"));
const signinUser_DTO_1 = __importDefault(require("../dtos/signinUser_DTO"));
function createUserMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const incomingRequestBody = new createUser_DTO_1.default(req.body.email, req.body.name, req.body.password);
        const errors = yield (0, class_validator_1.validate)(incomingRequestBody);
        if (errors.length > 0) {
            const errorResponse = errors.map((err) => {
                return {
                    property: err.property,
                    constraints: err.constraints,
                };
            });
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                err: new badRequest_1.default(errorResponse),
                data: {},
                success: false,
                message: "Invalid parameters sent in the request",
            });
        }
        next();
    });
}
exports.createUserMiddleware = createUserMiddleware;
function signInValidator(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const incomingRequestBody = new signinUser_DTO_1.default(req.body.email, req.body.password);
        const errors = yield (0, class_validator_1.validate)(incomingRequestBody);
        if (errors.length > 0) {
            const errorResponse = errors.map((err) => {
                return {
                    property: err.property,
                    constraints: err.constraints,
                };
            });
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                err: new badRequest_1.default(errorResponse),
                data: {},
                success: false,
                message: "Invalid parameters sent in the request",
            });
        }
        next();
    });
}
exports.signInValidator = signInValidator;
