import express from "express";
import { 
  createContract, 
  getAllContracts, 
  getContractById, 
  updateContract, 
  deleteContract 
} from "../controllers/contractController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import requireRole from "../middlewares/requireRole.js";
const router = express.Router();

/**
 * @route   POST /api/contracts
 * @desc    Create a new contract
 * @access  Private/Admin
 */
router.post("/", authMiddleware, requireRole("admin"), createContract);

/**
 * @route   GET /api/contracts
 * @desc    Get all contracts
 * @access  Private/Admin
 */
router.get("/", authMiddleware, requireRole("admin"), getAllContracts);

/**
 * @route   GET /api/contracts/:id
 * @desc    Get a single contract by ID
 * @access  Private/Admin   
 */
router.get("/:id", authMiddleware, requireRole("admin"), getContractById);

/**
 * @route   PUT /api/contracts/:id
 * @desc    Update contract details
 * @access  Private/Admin
 */
router.put("/:id", authMiddleware, requireRole("admin"), updateContract);

/**
 * @route   DELETE /api/contracts/:id
 * @desc    Remove a contract
 * @access  Private/Admin
 */
router.delete("/:id", authMiddleware, requireRole("admin"), deleteContract);

export default router;