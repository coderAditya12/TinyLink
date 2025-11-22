import express from "express";
import dotenv from "dotenv"
import linkRoute from "./routes/link.route.js"
import  { main } from "./config/db.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use("/api",linkRoute)
app.get("/healthz", (req, res) => {
  res.send("Server is healthy");
});
app.listen(4444, () => {
  main();
  console.log("Server is running on port 4444");
});

