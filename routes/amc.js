import express from "express";
import { 
  createDetailedAMC, 
  getAllAMCs, 
  updateDetailedAMC, 
  deleteAMC 
} from "../controllers/amcController.js";

const router = express.Router();

// Get all AMCs (Detailed)
router.get("/", getAllAMCs);

// Create a new Detailed AMC
router.post("/", createDetailedAMC);

// Update an existing AMC and its configs
router.put("/:id", updateDetailedAMC);

// Delete an AMC
router.delete("/:id", deleteAMC);

export default router;