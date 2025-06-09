"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = exports.generateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const server_config_1 = __importDefault(require("../config/server_config"));
// Fix: Only pass expiresIn if it is a valid string (with time unit) or a number (seconds)
function generateJWT(payload) {
    const secret = server_config_1.default.JWT_SECRET || "DUMMY";
    const expiresIn = server_config_1.default.JWT_EXPIRY;
    // Convert class instance to plain object if needed
    let jwtPayload = payload;
    if (typeof payload === "object" && payload !== null && !(payload instanceof Buffer)) {
        jwtPayload = JSON.parse(JSON.stringify(payload));
    }
    // Only pass expiresIn if it is a valid string (e.g., "6h", "1d", "3600s") or a number
    if ((typeof expiresIn === "string" && /^[0-9]+[smhd]$|^[0-9]+$/.test(expiresIn)) ||
        typeof expiresIn === "number") {
        // @ts-ignore
        return jsonwebtoken_1.default.sign(jwtPayload, secret, { expiresIn });
    }
    else {
        return jsonwebtoken_1.default.sign(jwtPayload, secret);
    }
}
exports.generateJWT = generateJWT;
function verifyJWT(token) {
    const secret = server_config_1.default.JWT_SECRET || "DUMMY";
    return jsonwebtoken_1.default.verify(token, secret);
}
exports.verifyJWT = verifyJWT;
