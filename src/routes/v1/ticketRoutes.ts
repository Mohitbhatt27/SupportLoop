import express from "express";
const ticketRouter = express.Router();
import ticketController from "../../controllers/ticket_controller";
import {
  isAdmin,
  isEngineer,
  isEngineerOrAdmin,
  isLoggedIn,
} from "../../middlewares/auth_middleware";

const {
  createTicket,
  updateTicket,
  getMyAssignedTickets,
  getMyCreatedTickets,
  getAllTicketsForAdmin,
  deleteTicket,
} = ticketController;

ticketRouter.post("/create", isLoggedIn, createTicket);

ticketRouter.patch("/update/:id", isLoggedIn, isEngineerOrAdmin, updateTicket);

ticketRouter.get(
  "/assignedTickets",
  isLoggedIn,
  isEngineer,
  getMyAssignedTickets
);

ticketRouter.get("/createdTickets", isLoggedIn, getMyCreatedTickets);

ticketRouter.get("/allTickets", isLoggedIn, isAdmin, getAllTicketsForAdmin);

ticketRouter.delete("/delete/:id", isLoggedIn, isEngineerOrAdmin, deleteTicket);

export default ticketRouter;
