import express from "express";
import {
    getLibrarian,
    booksLibrarian,
} from "../controllers/librarian.controller.js";

const router = express.Router();

router.get("/Librarian-Dashboard", getLibrarian);
router.get("/Librarian-Books", booksLibrarian);

export default router;