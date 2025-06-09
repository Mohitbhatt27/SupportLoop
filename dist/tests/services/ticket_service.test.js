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
const ticket_service_1 = __importDefault(require("../../src/services/ticket_service"));
const ticket_repository_1 = __importDefault(require("../../src/repositories/ticket_repository"));
const user_repository_1 = __importDefault(require("../../src/repositories/user_repository"));
const unauthorisedError_1 = __importDefault(require("../../src/errors/unauthorisedError"));
const notFound_1 = __importDefault(require("../../src/errors/notFound"));
const client_1 = require("@prisma/client");
jest.mock("../../src/repositories/ticket_repository");
jest.mock("../../src/repositories/user_repository");
describe("TicketService - updateTicket", () => {
    let ticketService;
    let ticketRepository;
    let userRepository;
    beforeEach(() => {
        ticketRepository = new ticket_repository_1.default();
        userRepository = new user_repository_1.default();
        ticketService = new ticket_service_1.default(ticketRepository, userRepository);
    });
    it("should throw NotFoundError if ticket does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        ticketRepository.getTicket.mockResolvedValue(null);
        yield expect(ticketService.updateTicket("ENGINEER", "engineer@example.com", "ticket123", {})).rejects.toThrow(notFound_1.default);
    }));
    it("should throw UnauthorisedError if user is not allowed", () => __awaiter(void 0, void 0, void 0, function* () {
        ticketRepository.getTicket.mockResolvedValue({
            id: "ticket123",
            title: "Test",
            description: "Test desc",
            ticketPriority: 1,
            status: client_1.Status.OPEN,
            assignee: "assignee@example.com",
            assignedTo: "other@example.com",
            clientName: "Client",
            createdBy: "creator@example.com",
            createdAt: new Date(),
            updatedAt: new Date(),
        }); // <-- add as any to silence type errors for partial mocks
        yield expect(ticketService.updateTicket("ENGINEER", "engineer@example.com", "ticket123", {})).rejects.toThrow(unauthorisedError_1.default);
    }));
    it("should update ticket if user is admin", () => __awaiter(void 0, void 0, void 0, function* () {
        const ticket = {
            id: "ticket123",
            title: "t",
            description: "d",
            ticketPriority: 1,
            status: client_1.Status.OPEN, // Use enum, not string
            assignee: "assignee@example.com",
            assignedTo: "someone@example.com",
            clientName: "Client",
            createdBy: "user@example.com",
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        ticketRepository.getTicket.mockResolvedValue(ticket);
        ticketRepository.updateTicket.mockResolvedValue(Object.assign(Object.assign({}, ticket), { status: client_1.Status.RESOLVED }));
        userRepository.getUserByEmail.mockResolvedValue({
            id: "userId",
            name: "User",
            email: "user@example.com",
            password: "hashed",
            role: "CUSTOMER",
            ticketsAssigned: [],
            ticketsCreated: [],
        });
        const result = yield ticketService.updateTicket("ADMIN", "admin@example.com", "ticket123", { status: "RESOLVED" });
        expect(result.status).toBe(client_1.Status.RESOLVED);
        expect(ticketRepository.updateTicket).toHaveBeenCalled();
    }));
});
// Additional unit tests for TicketService
describe("TicketService - createTicket", () => {
    let ticketService;
    let ticketRepository;
    let userRepository;
    beforeEach(() => {
        ticketRepository = new ticket_repository_1.default();
        userRepository = new user_repository_1.default();
        ticketService = new ticket_service_1.default(ticketRepository, userRepository);
    });
    it("should throw NotFoundError if user does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        userRepository.getUserById.mockResolvedValue(null);
        yield expect(ticketService.createTicket({}, "userId")).rejects.toThrow(notFound_1.default);
    }));
    it("should create ticket and assign engineer", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            id: "userId",
            email: "user@example.com",
            ticketsCreated: [],
            ticketsAssigned: [],
            name: "User",
            password: "hashed",
            role: "CUSTOMER",
        };
        const engineer = {
            id: "engId",
            email: "eng@example.com",
            ticketsAssigned: [],
            ticketsCreated: [],
            name: "Engineer",
            password: "hashed",
            role: "ENGINEER",
        };
        userRepository.getUserById.mockResolvedValue(user);
        userRepository.getAvailableEngineers.mockResolvedValue([engineer]);
        ticketRepository.createTicket.mockResolvedValue({
            id: "ticketId",
            title: "t",
            description: "d",
            ticketPriority: 1,
            status: client_1.Status.OPEN,
            assignee: user.email,
            assignedTo: engineer.email,
            clientName: "Client",
            createdBy: user.email,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        userRepository.updateUser.mockResolvedValue({});
        // ticketMailer is not awaited in service, so no need to mock
        const result = yield ticketService.createTicket({ title: "t", description: "d" }, "userId");
        expect(ticketRepository.createTicket).toHaveBeenCalled();
        expect(userRepository.updateUser).toHaveBeenCalled();
        expect(result.id).toBe("ticketId");
    }));
});
describe("TicketService - getMyAssignedTickets", () => {
    let ticketService;
    let ticketRepository;
    let userRepository;
    beforeEach(() => {
        ticketRepository = new ticket_repository_1.default();
        userRepository = new user_repository_1.default();
        ticketService = new ticket_service_1.default(ticketRepository, userRepository);
    });
    it("should throw NotFoundError if user does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        userRepository.getUserById.mockResolvedValue(null);
        yield expect(ticketService.getMyAssignedTickets("userId")).rejects.toThrow(notFound_1.default);
    }));
    it("should return assigned tickets", () => __awaiter(void 0, void 0, void 0, function* () {
        userRepository.getUserById.mockResolvedValue({
            id: "userId",
            email: "user@example.com",
            ticketsAssigned: ["t1", "t2"],
            ticketsCreated: [],
            name: "User",
            password: "hashed",
            role: "ENGINEER",
        });
        ticketRepository.findManyByIds.mockResolvedValue([
            {
                id: "t1",
                title: "Ticket 1",
                description: "desc",
                ticketPriority: 1,
                status: client_1.Status.OPEN,
                assignee: "a",
                assignedTo: "b",
                clientName: "Client",
                createdBy: "user@example.com",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: "t2",
                title: "Ticket 2",
                description: "desc",
                ticketPriority: 1,
                status: client_1.Status.OPEN,
                assignee: "a",
                assignedTo: "b",
                clientName: "Client",
                createdBy: "user@example.com",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
        const result = yield ticketService.getMyAssignedTickets("userId");
        expect(result).toHaveLength(2);
    }));
});
describe("TicketService - deleteTicket", () => {
    let ticketService;
    let ticketRepository;
    let userRepository;
    beforeEach(() => {
        ticketRepository = new ticket_repository_1.default();
        userRepository = new user_repository_1.default();
        ticketService = new ticket_service_1.default(ticketRepository, userRepository);
    });
    it("should throw NotFoundError if ticket does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        ticketRepository.getTicket.mockResolvedValue(null);
        yield expect(ticketService.deleteTicket("ADMIN", "admin@example.com", "ticketId")).rejects.toThrow(notFound_1.default);
    }));
    it("should throw UnauthorisedError if not admin or assigned engineer", () => __awaiter(void 0, void 0, void 0, function* () {
        ticketRepository.getTicket.mockResolvedValue({
            id: "ticketId",
            title: "t",
            description: "d",
            ticketPriority: 1,
            status: client_1.Status.OPEN,
            assignee: "assignee@example.com",
            assignedTo: "other@example.com",
            clientName: "Client",
            createdBy: "user@example.com",
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        yield expect(ticketService.deleteTicket("ENGINEER", "engineer@example.com", "ticketId")).rejects.toThrow(unauthorisedError_1.default);
    }));
    it("should delete ticket and update users", () => __awaiter(void 0, void 0, void 0, function* () {
        const ticket = {
            id: "ticketId",
            assignedTo: "eng@example.com",
            createdBy: "user@example.com",
            title: "t",
            description: "d",
            ticketPriority: 1,
            status: client_1.Status.OPEN,
            assignee: "assignee@example.com",
            clientName: "Client",
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const engineer = {
            id: "engId",
            name: "Engineer",
            email: "eng@example.com",
            password: "hashed",
            role: "ENGINEER",
            ticketsAssigned: ["ticketId"],
            ticketsCreated: [],
        };
        const user = {
            id: "userId",
            name: "User",
            email: "user@example.com",
            password: "hashed",
            role: "CUSTOMER",
            ticketsCreated: ["ticketId"],
            ticketsAssigned: [],
        };
        ticketRepository.getTicket.mockResolvedValue(ticket);
        ticketRepository.deleteTicket.mockResolvedValue(ticket);
        userRepository.getUserByEmail.mockImplementation(email => {
            if (email === "eng@example.com")
                return Promise.resolve(engineer);
            if (email === "user@example.com")
                return Promise.resolve(user);
            return Promise.resolve(null);
        });
        userRepository.updateUser.mockResolvedValue({});
        const result = yield ticketService.deleteTicket("ADMIN", "admin@example.com", "ticketId");
        expect(ticketRepository.deleteTicket).toHaveBeenCalledWith("ticketId");
        expect(userRepository.updateUser).toHaveBeenCalledTimes(2);
        expect(result).toEqual(ticket);
    }));
});
