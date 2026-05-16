import express from "express";
import {librarianDashboard} from "../controllers/librarian.controller.js";

const router = express.Router();

router.get("/Librarian-Dashboard", librarianDashboard);

export default router;