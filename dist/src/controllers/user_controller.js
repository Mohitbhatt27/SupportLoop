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
const user_service_1 = __importDefault(require("../services/user_service"));
const user_repository_1 = __importDefault(require("../repositories/user_repository"));
const genericError_1 = __importDefault(require("../errors/genericError"));
const http_status_codes_1 = require("http-status-codes");
const response_utils_1 = require("../utils/response.utils");
const userService = new user_service_1.default(new user_repository_1.default());
function getUserById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        try {
            const response = yield userService.getUserById(id);
            return res.status(200).json({
                message: "Successfully fetched the user",
                data: response,
                err: {},
                success: true,
            });
        }
        catch (error) {
            if (error instanceof genericError_1.default) {
                return res.status(error.statusCode).json({
                    message: "Something went wrong",
                    data: {},
                    err: error,
                    success: false,
                });
            }
            return res
                .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                .json(response_utils_1.unknownErrorResponse);
        }
    });
}
function getAllUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield userService.getAllUsers();
            return res.status(200).json({
                message: "Successfully fetched the users",
                data: response,
                err: {},
                success: true,
            });
        }
        catch (error) {
            if (error instanceof genericError_1.default) {
                return res.status(error.statusCode).json({
                    message: "Something went wrong",
                    data: {},
                    err: error,
                    success: true,
                });
            }
            return res
                .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                .json(response_utils_1.unknownErrorResponse);
        }
    });
}
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield userService.createUser(req.body);
            return res.status(201).json({
                message: "Successfully created the user",
                data: response,
                err: {},
                success: true,
            });
        }
        catch (error) {
            if (error instanceof genericError_1.default) {
                return res.status(error.statusCode).json({
                    message: "Something went wrong",
                    data: {},
                    err: error,
                    success: true,
                });
            }
            return res
                .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                .json(response_utils_1.unknownErrorResponse);
        }
    });
}
function signinUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield userService.signinUser(req.body);
            return res.status(200).json({
                message: "Successfully signed in the user",
                data: response,
                err: {},
                success: true,
            });
        }
        catch (error) {
            if (error instanceof genericError_1.default) {
                return res.status(error.statusCode).json({
                    message: "Something went wrong",
                    data: {},
                    err: error,
                    success: true,
                });
            }
            return res
                .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                .json(response_utils_1.unknownErrorResponse);
        }
    });
}
function updateUserRole(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const role = req.body.role;
        try {
            const response = yield userService.updateUserRole(id, role);
            return res.status(200).json({
                message: "Successfully updated the user role",
                data: response,
                err: {},
                success: true,
            });
        }
        catch (error) {
            if (error instanceof genericError_1.default) {
                return res.status(error.statusCode).json({
                    message: "Something went wrong",
                    data: {},
                    err: error,
                    success: true,
                });
            }
            return res
                .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                .json(response_utils_1.unknownErrorResponse);
        }
    });
}
exports.default = {
    getUserById,
    getAllUsers,
    createUser,
    signinUser,
    updateUserRole,
};
