"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const server_config_1 = __importDefault(require("./server_config"));
const { GMAIL_PASS, GMAIL_EMAIL } = server_config_1.default;
const mailsender = nodemailer_1.default.createTransport({
    service: "Gmail",
    auth: {
        user: GMAIL_EMAIL,
        pass: GMAIL_PASS,
    },
});
exports.default = mailsender;
