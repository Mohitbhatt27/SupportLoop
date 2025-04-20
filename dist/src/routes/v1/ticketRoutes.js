"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ticketRouter = express_1.default.Router();
const ticket_controller_1 = __importDefault(require("../../controllers/ticket_controller"));
const auth_middleware_1 = require("../../middlewares/auth_middleware");
const { createTicket, updateTicket, getMyAssignedTickets, getMyCreatedTickets, getAllTicketsForAdmin, deleteTicket, } = ticket_controller_1.default;
ticketRouter.post("/create", auth_middleware_1.isLoggedIn, createTicket);
ticketRouter.patch("/update/:id", auth_middleware_1.isLoggedIn, auth_middleware_1.isEngineerOrAdmin, updateTicket);
ticketRouter.get("/assignedTickets", auth_middleware_1.isLoggedIn, auth_middleware_1.isEngineer, getMyAssignedTickets);
ticketRouter.get("/createdTickets", auth_middleware_1.isLoggedIn, getMyCreatedTickets);
ticketRouter.get("/allTickets", auth_middleware_1.isLoggedIn, auth_middleware_1.isAdmin, getAllTicketsForAdmin);
ticketRouter.delete("/delete/:id", auth_middleware_1.isLoggedIn, auth_middleware_1.isEngineerOrAdmin, deleteTicket);
exports.default = ticketRouter;
