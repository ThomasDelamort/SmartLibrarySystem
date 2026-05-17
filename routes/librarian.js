import express from "express";
import {
    getLibrarian,
} from "../controllers/librarian.controller.js";

const router = express.Router();

router.get("/Librarian-Dashboard", getLibrarian);

export default router;