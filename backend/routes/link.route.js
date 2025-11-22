import express from "express";
import {
  createLinks,
  deleteLink,
  getAllLinks,
  getLinkStats,
  redirectLink,
} from "../controller/link.controller.js";
const route = express.Router();

route.post("/links", createLinks);
route.get("/link/:code", getLinkStats);
route.get("/links", getAllLinks);
route.delete("/link/:code", deleteLink);
route.get("/:code", redirectLink);
export default route;
