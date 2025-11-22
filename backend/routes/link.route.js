import express from "express"
import { createLinks } from "../controller/link.controller.js";
const route = express.Router();

route.post("/shorten",createLinks)
export default route;