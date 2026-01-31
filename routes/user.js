import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import requireRole from "../middlewares/requireRole.js";
import {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  getUsersBasicInfo
} from "../controllers/userController.js";

const router = express.Router();

/* ADMIN ONLY */
router.post("/", authMiddleware, requireRole(["admin"]), createUser);
router.get("/", authMiddleware, requireRole(["admin"]), getUsers);
router.put("/:id", authMiddleware, requireRole(["admin"]), updateUser);
router.delete("/:id", authMiddleware, requireRole(["admin"]), deleteUser);


// Basic info of customers mobile number email and name
router.get("/basicInfo", getUsersBasicInfo);

export default router;
