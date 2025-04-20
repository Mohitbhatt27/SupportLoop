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
exports.default = ticketMailer;
const email_config_1 = __importDefault(require("../config/email_config"));
const server_config_1 = __importDefault(require("../config/server_config"));
function ticketMailer(ReceiverEmail, ticketId, ticketTitle, ticketDescription, userName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield email_config_1.default.sendMail({
                from: server_config_1.default.GMAIL_EMAIL,
                to: `${ReceiverEmail}`,
                text: `Hello ${userName ? userName : "User"},\n\nWe have received your support ticket. Here are the details:\n\nTicket ID: ${ticketId}\nTitle: ${ticketTitle}\nDescription: ${ticketDescription}\n\nOur support team will review your ticket and get back to you as soon as possible.\n\nThank you for reaching out to us!\n\nBest regards,\nYour Company Name Support Team`,
                subject: `Your Support Ticket [#${ticketId}] Has Been Created`,
                html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Your Support Ticket Has Been Created</title>
            </head>
            <body>
                <p>Hello ${userName},</p>
                <p>We have received your support ticket. Here are the details:</p>
                <table border="1" cellpadding="10" cellspacing="0">
                    <tr>
                        <th>Ticket ID</th>
                        <td>${ticketId}</td>
                    </tr>
                    <tr>
                        <th>Title</th>
                        <td>${ticketTitle}</td>
                    </tr>
                    <tr>
                        <th>Description</th>
                        <td>${ticketDescription}</td>
                    </tr>
                </table>
                <p>Our support team will review your ticket and get back to you as soon as possible.</p>
                <p>Thank you for reaching out to us!</p>
                <p>Best regards,<br>CRM APP Support Team</p>
            </body>
            </html>
        `,
            });
            console.log(response);
        }
        catch (error) {
            console.log(error);
        }
    });
}
