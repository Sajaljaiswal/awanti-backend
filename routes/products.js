import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import requireRole from "../middlewares/requireRole.js";
import {
  getProducts,
  createProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// GET all products (admin only)
router.get("/", authMiddleware, requireRole(["admin"]), getProducts);

// CREATE product (admin only)
router.post("/", authMiddleware, requireRole(["admin"]), createProduct);

// DELETE product (admin only)
router.delete("/:id", authMiddleware, requireRole(["admin"]), deleteProduct);

export default router;
