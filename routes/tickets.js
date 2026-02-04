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
  getLatestStatus,
  getTicketDetails
  
} from "../controllers/ticketController.js";

const router = express.Router();

/* ADMIN ONLY */   
router.post("/", authMiddleware, requireRole(["admin"]), createTicket);
router.delete("/:id", authMiddleware, requireRole(["admin"]), deleteTicket);
router.put("/:id", authMiddleware, requireRole(["admin"]), updateTicket);
router.get("/allstatus",authMiddleware,requireRole(["admin"]),getLatestStatus);
router.get("/:id/details",authMiddleware,requireRole(["admin"]), getTicketDetails);
/* ADMIN + STAFF */
router.get("/", authMiddleware, getAllTickets); 
// router.patch("/:id/status", authMiddleware, updateTicketStatus);
router.put("/:id/assign", authMiddleware, requireRole(["admin"]), assignTicket);

// routes/ticketRoutes.js
router.patch("/:id/status", authMiddleware, (req, res, next) => {
    console.log("ROUTE HIT HO GAYA! ID:", req.params.id);
    next();
}, updateTicketStatus);
export default router;
