import express from "express";

import {
    getStudents,
    filterStudentBooks,
    searchStudentBooks,
    submitBook,
    getStudentBook,
    getBorrowedBooks,
    returnBook
} from "../controllers/student.controller.js";
import { studentAuth } from "../controllers/middleware/auth.middleware.js";

const router = express.Router();

router.get("/Students", studentAuth, getStudents);

router.get("/Filter", studentAuth, filterStudentBooks);

router.get("/Search-Book", studentAuth, searchStudentBooks);

router.post("/Submit", studentAuth, submitBook);

router.get("/Students/Book/:title", getStudentBook);

router.get("/Students/Borrowed", studentAuth, getBorrowedBooks);

router.post("/Students/Return", studentAuth, returnBook);

export default router;