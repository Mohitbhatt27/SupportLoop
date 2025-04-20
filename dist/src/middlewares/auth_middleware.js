"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLoggedIn = isLoggedIn;
exports.isAdmin = isAdmin;
exports.isEngineer = isEngineer;
exports.isEngineerOrAdmin = isEngineerOrAdmin;
const unauthorisedError_1 = __importDefault(require("../errors/unauthorisedError"));
const http_status_codes_1 = require("http-status-codes");
const auth_1 = require("../utils/auth");
function isLoggedIn(req, res, next) {
    if (!req.headers || !req.headers["x-access-token"]) {
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            err: new unauthorisedError_1.default(),
            data: {},
            success: false,
            message: "Invalid parameters sent in the request",
        });
    }
    let token = req.headers["x-access-token"].toString();
    let decodedToken;
    try {
        decodedToken = (0, auth_1.verifyJWT)(token);
        req.user = decodedToken;
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            err: new unauthorisedError_1.default(),
            data: {},
            success: false,
            message: "Invalid parameters sent in the request",
        });
    }
    next();
}
function isAdmin(req, res, next) {
    try {
        const roles = req.user.role;
        const isAdmin = roles === "ADMIN";
        if (isAdmin) {
            next();
        }
        else {
            throw new unauthorisedError_1.default();
        }
    }
    catch (_a) {
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            err: new unauthorisedError_1.default(),
            data: {},
            success: false,
            message: "You are not authorised to do this operation",
        });
    }
}
function isEngineer(req, res, next) {
    try {
        const roles = req.user.role;
        if (roles === "ENGINEER") {
            next();
        }
        else {
            throw new unauthorisedError_1.default();
        }
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            err: new unauthorisedError_1.default(),
            data: {},
            success: false,
            message: "You are not authorised to do this operation",
        });
    }
}
function isEngineerOrAdmin(req, res, next) {
    try {
        const roles = req.user.role;
        if (roles === "ENGINEER" || roles === "ADMIN") {
            next();
        }
        else {
            throw new unauthorisedError_1.default();
        }
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            err: new unauthorisedError_1.default(),
            data: {},
            success: false,
            message: "You are not authorised to do this operation",
        });
    }
}
