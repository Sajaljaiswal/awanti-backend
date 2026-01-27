import express from "express";
import { 
  createDetailedAMC, 
  getAllAMCs, 
  updateDetailedAMC, 
  deleteAMC 
} from "../controllers/amcController.js";

const router = express.Router();

/* ADMIN ONLY */
router.post("/" ,authMiddleware,requireRole(['admin']),createAMC);
router.get("/", authMiddleware, requireRole(["admin"]), getAllAMCs);
router.put("/:id", authMiddleware, requireRole(["admin"]), updateAMC);
router.delete("/:id", authMiddleware, requireRole(["admin"]), deleteAMC);


export default router;