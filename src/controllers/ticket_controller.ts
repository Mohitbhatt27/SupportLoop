import { Request, Response } from "express";
import TicketService from "../services/ticket_service";
import TicketRepository from "../repositories/ticket_repository";
import GenericError from "../errors/genericError";
import { StatusCodes } from "http-status-codes";
import { unknownErrorResponse } from "../utils/response.utils";
import UserRepository from "../repositories/user_repository";

const ticketService = new TicketService(
  new TicketRepository(),
  new UserRepository()
);

async function createTicket(req: Request, res: Response) {
  try {
    const response = await ticketService.createTicket(req.body, req.user.id);
    return res.status(201).json({
      message: "Successfully created the ticket",
      data: response,
      err: {},
      success: true,
    });
  } catch (error) {
    if (error instanceof GenericError) {
      return res.status(error.statusCode).json({
        message: "Something went wrong",
        data: {},
        err: error,
        success: true,
      });
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(unknownErrorResponse);
  }
}

async function updateTicket(req: Request, res: Response) {
  try {
    if (req.body.ticketPriority) {
      req.body.ticketPriority = Number(req.body.ticketPriority);
    }
    const response = await ticketService.updateTicket(
      req.user.role,
      req.user.email,
      req.params.id,
      req.body
    );
    return res.status(200).json({
      message: "Successfully updated the ticket",
      data: response,
      err: {},
      success: true,
    });
  } catch (error) {
    if (error instanceof GenericError) {
      return res.status(error.statusCode).json({
        message: "Something went wrong",
        data: {},
        err: error,
        success: true,
      });
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(unknownErrorResponse);
  }
}

async function getMyAssignedTickets(req: Request, res: Response) {
  try {
    const response = await ticketService.getMyAssignedTickets(req.user.id);
    return res.status(200).json({
      message: "Successfully fetched the tickets",
      data: response,
      err: {},
      success: true,
    });
  } catch (error) {
    if (error instanceof GenericError) {
      return res.status(error.statusCode).json({
        message: "Something went wrong",
        data: {},
        err: error,
        success: true,
      });
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(unknownErrorResponse);
  }
}

async function getMyCreatedTickets(req: Request, res: Response) {
  try {
    const response = await ticketService.getMyCreatedTickets(req.user.id);
    return res.status(200).json({
      message: "Successfully fetched the tickets",
      data: response,
      err: {},
      success: true,
    });
  } catch (error) {
    if (error instanceof GenericError) {
      return res.status(error.statusCode).json({
        message: "Something went wrong",
        data: {},
        err: error,
        success: true,
      });
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(unknownErrorResponse);
  }
}

async function getAllTicketsForAdmin(req: Request, res: Response) {
  try {
    const response = await ticketService.getAllTicketsForAdmin();
    return res.status(200).json({
      message: "Successfully fetched the tickets",
      data: response,
      err: {},
      success: true,
    });
  } catch (error) {
    if (error instanceof GenericError) {
      return res.status(error.statusCode).json({
        message: "Something went wrong",
        data: {},
        err: error,
        success: true,
      });
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(unknownErrorResponse);
  }
}

async function deleteTicket(req: Request, res: Response) {
  try {
    const response = await ticketService.deleteTicket(
      req.user.role,
      req.user.email,
      req.params.id
    );
    return res.status(200).json({
      message: "Successfully deleted the ticket",
      data: response,
      err: {},
      success: true,
    });
  } catch (error) {
    if (error instanceof GenericError) {
      return res.status(error.statusCode).json({
        message: "Something went wrong",
        data: {},
        err: error,
        success: true,
      });
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(unknownErrorResponse);
  }
}

export default {
  createTicket,
  updateTicket,
  getMyAssignedTickets,
  getMyCreatedTickets,
  getAllTicketsForAdmin,
  deleteTicket,
};
