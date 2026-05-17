import express from "express";
import {
    librarianBooks,
    librarianDashboard,
    librarianStudents
} from "../controllers/librarian.controller.js";

const router = express.Router();

router.get("/Librarian-Dashboard", librarianDashboard);
router.get("/Librarian-Books", librarianBooks);
router.get("/Librarian-Students", librarianStudents);

export default router;