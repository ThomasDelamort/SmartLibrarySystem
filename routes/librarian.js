import express from "express";
import {
    getLibrarian,
    booksLibrarian,
    studentsLists,
    transactions,
    approveTransaction,
    rejectTransaction
} from "../controllers/librarian.controller.js";
import { librarianAuth } from "../controllers/middleware/auth.middleware.js";

const router = express.Router();

router.get("/Librarian-Dashboard", librarianAuth, getLibrarian);
router.get("/Librarian-Books", librarianAuth, booksLibrarian);
router.get("/Librarian-SL", librarianAuth, studentsLists); // SL -> Students List
router.get("/Librarian-Transactions", librarianAuth, transactions);
router.post( "/Librarian-Transactions/Approve/:id", librarianAuth, approveTransaction);
router.post("/Librarian-Transactions/Reject/:id", librarianAuth, rejectTransaction);

export default router;