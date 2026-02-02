import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { createRequest,getAllRequests } from "../controllers/request.js";
import requireRole from "../middlewares/requireRole.js";

const router = express.Router();

// route for creating request
router.post("/create",  createRequest);


// route for admin to get all requests from user
router.get("/all", authMiddleware, requireRole(["admin"]), getAllRequests);

export default router;
