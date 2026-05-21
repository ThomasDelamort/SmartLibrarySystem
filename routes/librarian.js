import express from "express";
import {
    getLibrarian,
    booksLibrarian,
    studentsLists,
    transactions
} from "../controllers/librarian.controller.js";

const router = express.Router();

router.get("/Librarian-Dashboard", getLibrarian);
router.get("/Librarian-Books", booksLibrarian);
router.get("/Librarian-SL", studentsLists); // SL -> Students List
router.get("/Librarian-Transactions", transactions);

export default router;