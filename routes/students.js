import express from "express";

import {
    getStudents,
    filterStudentBooks,
    searchStudentBooks,
    submitBook,
    getStudentBook
} from "../controllers/student.controller.js";

const router = express.Router();

router.get("/Students", getStudents);

router.get("/Filter", filterStudentBooks);

router.get("/Search-Book", searchStudentBooks);

router.post("/Submit", submitBook);

router.get("/Students/Book/:title", getStudentBook);

export default router;