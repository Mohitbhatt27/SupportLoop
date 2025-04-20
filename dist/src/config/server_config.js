"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = {
    PORT: process.env.PORT || 3000,
    SALT: process.env.SALT == undefined ? 10 : +process.env.SALT,
    JWT_SECRET: process.env.JWT_SECRET == undefined ? "DUMMY" : process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY,
    GMAIL_PASS: process.env.GMAIL_PASS || "",
    GMAIL_EMAIL: process.env.GMAIL_EMAIL || "",
};
