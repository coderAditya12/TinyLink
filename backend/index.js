import express from "express";
import dotenv from "dotenv";
import linkRoute from "./routes/link.route.js";
import { main } from "./config/db.js";
import cors from "cors";
dotenv.config();
const app = express();
app.use(
  cors({
    methods: "*",
    origin: "*",
  })
);
app.use(express.json());
app.use("/api", linkRoute);
app.get("/healthz", (req, res) => {
  res.send("Server is healthy");
});
app.listen(4444, () => {
  main();
  console.log("Server is running on port 4444");
});
//DATABASE_URL="postgresql://neondb_owner:npg_WxKX3Ny8DmfU@ep-icy-thunder-a17t8cf6-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
