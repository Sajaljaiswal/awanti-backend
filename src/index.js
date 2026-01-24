import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import express from "express";
import cors from "cors";


import productRoutes from "../routes/products.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/products", productRoutes);

app.get("/health", (req, res) => {
  res.send("Backend running ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
