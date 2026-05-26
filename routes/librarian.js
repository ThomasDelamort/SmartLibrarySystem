import express from "express";
import {
    getLibrarian,
    booksLibrarian,
    studentsLists,
    transactions,
    approveTransaction,
    rejectTransaction,
    confirmReturn,
    approveRoomTransaction,
    rejectRoomTransaction,

} from "../controllers/librarian.controller.js";
import { librarianAuth } from "../controllers/middleware/auth.middleware.js";

const router = express.Router();

router.get("/Librarian-Dashboard", librarianAuth, getLibrarian);
router.get("/Librarian-Books", librarianAuth, booksLibrarian);
router.get("/Librarian-SL", librarianAuth, studentsLists); // SL -> Students List
router.get("/Librarian-Transactions", librarianAuth, transactions);
router.post( "/Librarian-Transactions/Approve/:id", librarianAuth, approveTransaction);
router.post("/Librarian-Transactions/Reject/:id", librarianAuth, rejectTransaction);
router.post("/Librarian-Transactions/Return/:id", librarianAuth, confirmReturn);

router.post("/Librarian-Transactions/Room/Approve/:id", librarianAuth, approveRoomTransaction);
router.post("/Librarian-Transactions/Room/Reject/:id", librarianAuth, rejectRoomTransaction);

export default router;