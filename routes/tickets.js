import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import requireRole from "../middlewares/requireRole.js";
import {
  createTicket,
  getAllTickets,
  deleteTicket,
  updateTicket,
  updateTicketStatus,
  assignTicket,
} from "../controllers/ticketController.js";

const router = express.Router();

/* ADMIN ONLY */   
router.post("/", authMiddleware, requireRole(["admin"]), createTicket);
router.delete("/:id", authMiddleware, requireRole(["admin"]), deleteTicket);
router.put("/:id", authMiddleware, requireRole(["admin"]), updateTicket);

/* ADMIN + STAFF */
router.get("/", authMiddleware, getAllTickets); 
router.patch("/:id/status", authMiddleware, updateTicketStatus);
router.put("/:id/assign", authMiddleware, requireRole(["admin"]), assignTicket);


export default router;
