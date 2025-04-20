"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJWT = generateJWT;
exports.verifyJWT = verifyJWT;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const server_config_1 = __importDefault(require("../config/server_config"));
// Fix: Explicitly cast JWT_SECRET and JWT_EXPIRY to the types expected by jsonwebtoken
function generateJWT(payload) {
    return jsonwebtoken_1.default.sign(payload, server_config_1.default.JWT_SECRET, { expiresIn: server_config_1.default.JWT_EXPIRY });
}
function verifyJWT(token) {
    return jsonwebtoken_1.default.verify(token, server_config_1.default.JWT_SECRET);
}
