import express from "express";
import dotenv from "dotenv"
import linkRoute from "./routes/link.route.js"
import prisma from "./config/db.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use("/",linkRoute)
app.get("/health", (req, res) => {
  res.send("Server is healthy");
});
app.listen(4444, () => {
  console.log("Server is running on port 4444");
});
