import { Ticket } from "@prisma/client";
import TicketRepository from "../repositories/ticket_repository";
import createTicketDto from "../dtos/createTicket_DTO";
import UserRepository from "../repositories/user_repository";
import NotFoundError from "../errors/notFound";
import UpdateTicketDto from "../dtos/updateTicket_DTO";
import UnauthorisedError from "../errors/unauthorisedError";
import ticketMailer from "../mailers/ticket_mailer";

class TicketService {
  ticketRepository: TicketRepository;
  userRepository: UserRepository;

  constructor(
    ticketRepository: TicketRepository,
    userRepository: UserRepository
  ) {
    this.ticketRepository = ticketRepository;
    this.userRepository = userRepository;
  }
  async createTicket(
    ticketDetails: createTicketDto,
    id: string
  ): Promise<Ticket> {
    try {
      const createdBy = await this.userRepository.getUserById(id);
      if (!createdBy) {
        throw new NotFoundError("User", "id", id);
      }
      const engineersToAllocate = (
        await this.getEngineerToAllocateTicket()
      ).filter((engineer) => engineer.id !== createdBy.id);
      const randomIndex = Math.floor(
        Math.random() * engineersToAllocate.length
      );
      const engineer = engineersToAllocate[randomIndex];

      ticketDetails.assignee = createdBy.email;
      ticketDetails.assignedTo = engineer.email;
      ticketDetails.createdBy = createdBy.email;

      const response: Ticket = await this.ticketRepository.createTicket(
        ticketDetails
      );

      await this.userRepository.updateUser(engineer.id, {
        ticketsAssigned: [...engineer.ticketsAssigned, response.id],
      });

      await this.userRepository.updateUser(createdBy.id, {
        ticketsCreated: [...createdBy.ticketsCreated, response.id],
      });

      ticketMailer(
        createdBy.email,
        response.id,
        response.title,
        response.description,
        createdBy.name
      );

      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateTicket(
    role: string,
    userEmail: string,
    id: string,
    ticketDetails: UpdateTicketDto
  ): Promise<Ticket> {
    try {
      const ticket = await this.ticketRepository.getTicket(id);
      if (!ticket) {
        throw new NotFoundError("Ticket", "id", id);
      }
      if (ticket.assignedTo != userEmail && role != "ADMIN") {
        console.log(ticket.assignedTo, userEmail, role);

        throw new UnauthorisedError();
      }

      const response: Ticket = await this.ticketRepository.updateTicket(
        id,
        ticketDetails
      );
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getEngineerToAllocateTicket() {
    try {
      const engineer = await this.userRepository.getAvailableEngineers();
      return engineer;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getMyAssignedTickets(id: string) {
    try {
      const response = await this.userRepository.getUserById(id);
      if (!response) {
        throw new NotFoundError("User", "id", id);
      }
      const ticketIds = response.ticketsAssigned;
      const ticketDetails = await this.ticketRepository.findManyByIds(
        ticketIds
      );
      return ticketDetails;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getMyCreatedTickets(id: string) {
    try {
      const user = await this.userRepository.getUserById(id);

      if (!user) {
        throw new NotFoundError("User", "id", id);
      }

      const ticketDetails = await this.ticketRepository.findManyByIds(
        user.ticketsCreated
      );

      return ticketDetails;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAllTicketsForAdmin() {
    try {
      const response = await this.ticketRepository.getAllTickets();
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteTicket(role: string, email: string, ticketId: string) {
    try {
      const ticket = await this.ticketRepository.getTicket(ticketId);
      if (!ticket) {
        throw new NotFoundError("Ticket", "id", ticketId);
      }

      if (role != "ADMIN" && ticket.assignedTo != email) {
        throw new UnauthorisedError();
      }

      const response = await this.ticketRepository.deleteTicket(ticketId);
      // need to remove this ticket from assigned tickets of engineer, and from created tickets of user

      const engineer = await this.userRepository.getUserByEmail(
        ticket.assignedTo
      );
      const user = await this.userRepository.getUserByEmail(ticket.createdBy);

      if (!engineer || !user) {
        throw new NotFoundError("User", "id", ticket.assignedTo);
      }

      await this.userRepository.updateUser(engineer.id, {
        ticketsAssigned: engineer.ticketsAssigned.filter(
          (ticket) => ticket != ticketId
        ),
      });
      await this.userRepository.updateUser(user.id, {
        ticketsCreated: user.ticketsCreated.filter(
          (ticket) => ticket != ticketId
        ),
      });

      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default TicketService;
