import express from "express";
import dotenv from "dotenv"
import prisma from "./config/db.js";
dotenv.config();
const app = express();
app.get("/health", (req, res) => {
  res.send("Server is healthy");
});
app.listen(4444, () => {
  console.log("Server is running on port 4444");
});
