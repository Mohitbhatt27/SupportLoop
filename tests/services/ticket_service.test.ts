import TicketService from "../../src/services/ticket_service";
import TicketRepository from "../../src/repositories/ticket_repository";
import UserRepository from "../../src/repositories/user_repository";
import UpdateTicketDto from "../../src/dtos/updateTicket_DTO";
import UnauthorisedError from "../../src/errors/unauthorisedError";
import NotFoundError from "../../src/errors/notFound";
import { Status } from "@prisma/client";

jest.mock("../../src/repositories/ticket_repository");
jest.mock("../../src/repositories/user_repository");

describe("TicketService - updateTicket", () => {
  let ticketService: TicketService;
  let ticketRepository: jest.Mocked<TicketRepository>;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    ticketRepository = new (TicketRepository as any)();
    userRepository = new (UserRepository as any)();
    ticketService = new TicketService(ticketRepository, userRepository);
  });

  it("should throw NotFoundError if ticket does not exist", async () => {
    ticketRepository.getTicket.mockResolvedValue(null);

    await expect(
      ticketService.updateTicket("ENGINEER", "engineer@example.com", "ticket123", {} as UpdateTicketDto)
    ).rejects.toThrow(NotFoundError);
  });

  it("should throw UnauthorisedError if user is not allowed", async () => {
    ticketRepository.getTicket.mockResolvedValue({
      id: "ticket123",
      title: "Test",
      description: "Test desc",
      ticketPriority: 1,
      status: Status.OPEN,
      assignee: "assignee@example.com",
      assignedTo: "other@example.com",
      clientName: "Client",
      createdBy: "creator@example.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any); // <-- add as any to silence type errors for partial mocks
    await expect(
      ticketService.updateTicket("ENGINEER", "engineer@example.com", "ticket123", {} as UpdateTicketDto)
    ).rejects.toThrow(UnauthorisedError);
  });

  it("should update ticket if user is admin", async () => {
    const ticket = {
      id: "ticket123",
      title: "t",
      description: "d",
      ticketPriority: 1,
      status: Status.OPEN, // Use enum, not string
      assignee: "assignee@example.com",
      assignedTo: "someone@example.com",
      clientName: "Client",
      createdBy: "user@example.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any;
    ticketRepository.getTicket.mockResolvedValue(ticket);
    ticketRepository.updateTicket.mockResolvedValue({
      ...ticket,
      status: Status.RESOLVED, // Use enum, not string
    } as any);
    userRepository.getUserByEmail.mockResolvedValue({
      id: "userId",
      name: "User",
      email: "user@example.com",
      password: "hashed",
      role: "CUSTOMER",
      ticketsAssigned: [],
      ticketsCreated: [],
    } as any);

    const result = await ticketService.updateTicket(
      "ADMIN",
      "admin@example.com",
      "ticket123",
      { status: "RESOLVED" } as UpdateTicketDto
    );
    expect(result.status).toBe(Status.RESOLVED);
    expect(ticketRepository.updateTicket).toHaveBeenCalled();
  });
});

// Additional unit tests for TicketService

describe("TicketService - createTicket", () => {
  let ticketService: TicketService;
  let ticketRepository: jest.Mocked<TicketRepository>;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    ticketRepository = new (TicketRepository as any)();
    userRepository = new (UserRepository as any)();
    ticketService = new TicketService(ticketRepository, userRepository);
  });

  it("should throw NotFoundError if user does not exist", async () => {
    userRepository.getUserById.mockResolvedValue(null);
    await expect(
      ticketService.createTicket({} as any, "userId")
    ).rejects.toThrow(NotFoundError);
  });

  it("should create ticket and assign engineer", async () => {
    const user = {
      id: "userId",
      email: "user@example.com",
      ticketsCreated: [],
      ticketsAssigned: [],
      name: "User",
      password: "hashed",
      role: "CUSTOMER",
    } as any;
    const engineer = {
      id: "engId",
      email: "eng@example.com",
      ticketsAssigned: [],
      ticketsCreated: [],
      name: "Engineer",
      password: "hashed",
      role: "ENGINEER",
    } as any;
    userRepository.getUserById.mockResolvedValue(user);
    userRepository.getAvailableEngineers.mockResolvedValue([engineer]);
    ticketRepository.createTicket.mockResolvedValue({
      id: "ticketId",
      title: "t",
      description: "d",
      ticketPriority: 1,
      status: Status.OPEN,
      assignee: user.email,
      assignedTo: engineer.email,
      clientName: "Client",
      createdBy: user.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);
    userRepository.updateUser.mockResolvedValue({} as any);
    // ticketMailer is not awaited in service, so no need to mock

    const result = await ticketService.createTicket(
      { title: "t", description: "d" } as any,
      "userId"
    );
    expect(ticketRepository.createTicket).toHaveBeenCalled();
    expect(userRepository.updateUser).toHaveBeenCalled();
    expect(result.id).toBe("ticketId");
  });
});

describe("TicketService - getMyAssignedTickets", () => {
  let ticketService: TicketService;
  let ticketRepository: jest.Mocked<TicketRepository>;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    ticketRepository = new (TicketRepository as any)();
    userRepository = new (UserRepository as any)();
    ticketService = new TicketService(ticketRepository, userRepository);
  });

  it("should throw NotFoundError if user does not exist", async () => {
    userRepository.getUserById.mockResolvedValue(null);
    await expect(
      ticketService.getMyAssignedTickets("userId")
    ).rejects.toThrow(NotFoundError);
  });

  it("should return assigned tickets", async () => {
    userRepository.getUserById.mockResolvedValue({
      id: "userId",
      email: "user@example.com",
      ticketsAssigned: ["t1", "t2"],
      ticketsCreated: [],
      name: "User",
      password: "hashed",
      role: "ENGINEER",
    } as any);
    ticketRepository.findManyByIds.mockResolvedValue([
      {
        id: "t1",
        title: "Ticket 1",
        description: "desc",
        ticketPriority: 1,
        status: Status.OPEN,
        assignee: "a",
        assignedTo: "b",
        clientName: "Client",
        createdBy: "user@example.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any,
      {
        id: "t2",
        title: "Ticket 2",
        description: "desc",
        ticketPriority: 1,
        status: Status.OPEN,
        assignee: "a",
        assignedTo: "b",
        clientName: "Client",
        createdBy: "user@example.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any,
    ]);
    const result = await ticketService.getMyAssignedTickets("userId");
    expect(result).toHaveLength(2);
  });
});

describe("TicketService - deleteTicket", () => {
  let ticketService: TicketService;
  let ticketRepository: jest.Mocked<TicketRepository>;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    ticketRepository = new (TicketRepository as any)();
    userRepository = new (UserRepository as any)();
    ticketService = new TicketService(ticketRepository, userRepository);
  });

  it("should throw NotFoundError if ticket does not exist", async () => {
    ticketRepository.getTicket.mockResolvedValue(null);
    await expect(
      ticketService.deleteTicket("ADMIN", "admin@example.com", "ticketId")
    ).rejects.toThrow(NotFoundError);
  });

  it("should throw UnauthorisedError if not admin or assigned engineer", async () => {
    ticketRepository.getTicket.mockResolvedValue({
      id: "ticketId",
      title: "t",
      description: "d",
      ticketPriority: 1,
      status: Status.OPEN,
      assignee: "assignee@example.com",
      assignedTo: "other@example.com",
      clientName: "Client",
      createdBy: "user@example.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);
    await expect(
      ticketService.deleteTicket("ENGINEER", "engineer@example.com", "ticketId")
    ).rejects.toThrow(UnauthorisedError);
  });

  it("should delete ticket and update users", async () => {
    const ticket = {
      id: "ticketId",
      assignedTo: "eng@example.com",
      createdBy: "user@example.com",
      title: "t",
      description: "d",
      ticketPriority: 1,
      status: Status.OPEN,
      assignee: "assignee@example.com",
      clientName: "Client",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any;
    const engineer = {
      id: "engId",
      name: "Engineer",
      email: "eng@example.com",
      password: "hashed",
      role: "ENGINEER",
      ticketsAssigned: ["ticketId"],
      ticketsCreated: [],
    } as any;
    const user = {
      id: "userId",
      name: "User",
      email: "user@example.com",
      password: "hashed",
      role: "CUSTOMER",
      ticketsCreated: ["ticketId"],
      ticketsAssigned: [],
    } as any;
    ticketRepository.getTicket.mockResolvedValue(ticket);
    ticketRepository.deleteTicket.mockResolvedValue(ticket);
    userRepository.getUserByEmail.mockImplementation(email => {
      if (email === "eng@example.com") return Promise.resolve(engineer);
      if (email === "user@example.com") return Promise.resolve(user);
      return Promise.resolve(null);
    });
    userRepository.updateUser.mockResolvedValue({} as any);
    const result = await ticketService.deleteTicket(
      "ADMIN",
      "admin@example.com",
      "ticketId"
    );
    expect(ticketRepository.deleteTicket).toHaveBeenCalledWith("ticketId");
    expect(userRepository.updateUser).toHaveBeenCalledTimes(2);
    expect(result).toEqual(ticket);
  });
});
