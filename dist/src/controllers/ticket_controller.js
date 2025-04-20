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
const ticket_service_1 = __importDefault(require("../services/ticket_service"));
const ticket_repository_1 = __importDefault(require("../repositories/ticket_repository"));
const genericError_1 = __importDefault(require("../errors/genericError"));
const http_status_codes_1 = require("http-status-codes");
const response_utils_1 = require("../utils/response.utils");
const user_repository_1 = __importDefault(require("../repositories/user_repository"));
const ticketService = new ticket_service_1.default(new ticket_repository_1.default(), new user_repository_1.default());
function createTicket(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield ticketService.createTicket(req.body, req.user.id);
            return res.status(201).json({
                message: "Successfully created the ticket",
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
function updateTicket(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (req.body.ticketPriority) {
                req.body.ticketPriority = Number(req.body.ticketPriority);
            }
            const response = yield ticketService.updateTicket(req.user.role, req.user.email, req.params.id, req.body);
            return res.status(200).json({
                message: "Successfully updated the ticket",
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
function getMyAssignedTickets(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield ticketService.getMyAssignedTickets(req.user.id);
            return res.status(200).json({
                message: "Successfully fetched the tickets",
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
function getMyCreatedTickets(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield ticketService.getMyCreatedTickets(req.user.id);
            return res.status(200).json({
                message: "Successfully fetched the tickets",
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
function getAllTicketsForAdmin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield ticketService.getAllTicketsForAdmin();
            return res.status(200).json({
                message: "Successfully fetched the tickets",
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
function deleteTicket(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield ticketService.deleteTicket(req.user.role, req.user.email, req.params.id);
            return res.status(200).json({
                message: "Successfully deleted the ticket",
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
    createTicket,
    updateTicket,
    getMyAssignedTickets,
    getMyCreatedTickets,
    getAllTicketsForAdmin,
    deleteTicket,
};
