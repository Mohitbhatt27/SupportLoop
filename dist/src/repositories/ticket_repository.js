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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class TicketRepository {
    createTicket(ticketDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield prisma.ticket.create({
                data: Object.assign({}, ticketDetails),
            });
            return response;
        });
    }
    getTicket(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield prisma.ticket.findUnique({
                where: {
                    id,
                },
            });
            return response;
        });
    }
    getAllTickets() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield prisma.ticket.findMany();
            return response;
        });
    }
    deleteTicket(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield prisma.ticket.delete({
                where: {
                    id,
                },
            });
            return response;
        });
    }
    updateTicket(id, ticketDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            // Convert status string to enum if present
            const data = Object.assign({}, ticketDetails);
            if (data.status && typeof data.status === "string") {
                data.status = client_1.Status[data.status];
            }
            const response = yield prisma.ticket.update({
                where: {
                    id,
                },
                data,
            });
            return response;
        });
    }
    findManyByIds(ticketIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tickets = yield prisma.ticket.findMany({
                    where: {
                        id: {
                            in: ticketIds,
                        },
                    },
                });
                return tickets;
            }
            catch (error) {
                console.error("Error fetching tickets:", error);
                throw error;
            }
        });
    }
}
exports.default = TicketRepository;
