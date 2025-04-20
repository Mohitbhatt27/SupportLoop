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
const notFound_1 = __importDefault(require("../errors/notFound"));
const unauthorisedError_1 = __importDefault(require("../errors/unauthorisedError"));
const ticket_mailer_1 = __importDefault(require("../mailers/ticket_mailer"));
class TicketService {
    constructor(ticketRepository, userRepository) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }
    createTicket(ticketDetails, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createdBy = yield this.userRepository.getUserById(id);
                if (!createdBy) {
                    throw new notFound_1.default("User", "id", id);
                }
                const engineersToAllocate = (yield this.getEngineerToAllocateTicket()).filter((engineer) => engineer.id !== createdBy.id);
                const randomIndex = Math.floor(Math.random() * engineersToAllocate.length);
                const engineer = engineersToAllocate[randomIndex];
                ticketDetails.assignee = createdBy.email;
                ticketDetails.assignedTo = engineer.email;
                ticketDetails.createdBy = createdBy.email;
                const response = yield this.ticketRepository.createTicket(ticketDetails);
                yield this.userRepository.updateUser(engineer.id, {
                    ticketsAssigned: [...engineer.ticketsAssigned, response.id],
                });
                yield this.userRepository.updateUser(createdBy.id, {
                    ticketsCreated: [...createdBy.ticketsCreated, response.id],
                });
                (0, ticket_mailer_1.default)(createdBy.email, response.id, response.title, response.description, createdBy.name);
                return response;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    updateTicket(role, userEmail, id, ticketDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ticket = yield this.ticketRepository.getTicket(id);
                if (!ticket) {
                    throw new notFound_1.default("Ticket", "id", id);
                }
                if (ticket.assignedTo != userEmail && role != "ADMIN") {
                    console.log(ticket.assignedTo, userEmail, role);
                    throw new unauthorisedError_1.default();
                }
                const response = yield this.ticketRepository.updateTicket(id, ticketDetails);
                return response;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getEngineerToAllocateTicket() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const engineer = yield this.userRepository.getAvailableEngineers();
                return engineer;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getMyAssignedTickets(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.userRepository.getUserById(id);
                if (!response) {
                    throw new notFound_1.default("User", "id", id);
                }
                const ticketIds = response.ticketsAssigned;
                const ticketDetails = yield this.ticketRepository.findManyByIds(ticketIds);
                return ticketDetails;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getMyCreatedTickets(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.getUserById(id);
                if (!user) {
                    throw new notFound_1.default("User", "id", id);
                }
                const ticketDetails = yield this.ticketRepository.findManyByIds(user.ticketsCreated);
                return ticketDetails;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getAllTicketsForAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.ticketRepository.getAllTickets();
                return response;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    deleteTicket(role, email, ticketId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ticket = yield this.ticketRepository.getTicket(ticketId);
                if (!ticket) {
                    throw new notFound_1.default("Ticket", "id", ticketId);
                }
                if (role != "ADMIN" && ticket.assignedTo != email) {
                    throw new unauthorisedError_1.default();
                }
                const response = yield this.ticketRepository.deleteTicket(ticketId);
                // need to remove this ticket from assigned tickets of engineer, and from created tickets of user
                const engineer = yield this.userRepository.getUserByEmail(ticket.assignedTo);
                const user = yield this.userRepository.getUserByEmail(ticket.createdBy);
                if (!engineer || !user) {
                    throw new notFound_1.default("User", "id", ticket.assignedTo);
                }
                yield this.userRepository.updateUser(engineer.id, {
                    ticketsAssigned: engineer.ticketsAssigned.filter((ticket) => ticket != ticketId),
                });
                yield this.userRepository.updateUser(user.id, {
                    ticketsCreated: user.ticketsCreated.filter((ticket) => ticket != ticketId),
                });
                return response;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
}
exports.default = TicketService;
