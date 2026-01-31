import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import express from "express";
import cors from "cors";
import productRoutes from "../routes/products.js";
import staffRoutes from "../routes/staff.js";
import ticketRoutes from "../routes/tickets.js";
import requestRoutes from "../routes/request.js";
import userRoutes from "../routes/user.js";
import amcRoutes from "../routes/amc.js";


import contractRoutes from "../routes/contract.js";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);

app.use("/api/contracts", contractRoutes);
app.use("/staff", staffRoutes);
app.use("/products", productRoutes);
app.use("/tickets", ticketRoutes);
app.use("/requests", requestRoutes);

app.get("/health", (req, res) => {
  res.send("Backend running ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
