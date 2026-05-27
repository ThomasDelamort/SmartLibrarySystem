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
    searchLibrarianBooks,
    searchLibrarianStudents,
    getAddBook,
    addBook,
    getEditBook,
    editBook,
    deleteBook,
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

router.get("/Librarian-Books/Search", librarianAuth, searchLibrarianBooks);
router.get("/Librarian-SL/Search", librarianAuth, searchLibrarianStudents);

router.get("/Librarian-Books/Add", librarianAuth, getAddBook);
router.post("/Librarian-Books/Add", librarianAuth, addBook);
router.get("/Librarian-Books/Edit/:id", librarianAuth, getEditBook);
router.post("/Librarian-Books/Edit/:id", librarianAuth, editBook);
router.post("/Librarian-Books/Delete/:id", librarianAuth, deleteBook);

export default router;