import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import requireRole from "../middlewares/requireRole.js";
import {
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  toggleStatus,
  getStaffById,
  getTicketsByStaff,
} from "../controllers/staffController.js";

const router = express.Router();

// ONLY ADMIN
router.get("/", authMiddleware, requireRole(["admin"]), getStaff);
router.post("/", authMiddleware, requireRole(["admin"]), createStaff);
router.put("/:id", authMiddleware, requireRole(["admin"]), updateStaff);
router.patch("/:id/status", authMiddleware, requireRole(["admin"]), toggleStatus);
router.delete("/:id", authMiddleware, requireRole(["admin"]), deleteStaff);
router.get("/:id", authMiddleware, getStaffById);
router.get(
  "/assigned/:staffId",
  authMiddleware,
  requireRole(["admin", "staff"]),
  getTicketsByStaff
);

export default router;
