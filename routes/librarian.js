import express from "express";
import {
    getLibrarian,
    booksLibrarian,
    studentsLists,
} from "../controllers/librarian.controller.js";

const router = express.Router();

router.get("/Librarian-Dashboard", getLibrarian);
router.get("/Librarian-Books", booksLibrarian);
router.get("/Librarian-SL", studentsLists); // SL -> Students List

export default router;