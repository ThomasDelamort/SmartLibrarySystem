import express from "express";

import {
    home,
    about,
    services,
    contact,
    librarianDashboard,
    login,
    getBooks,
    searchBooks,
    filterBooks,
    viewBook,
    getBook
} from "../controllers/page.controller.js";

const router = express.Router();

router.get("/", home);
router.get("/About", about);
router.get("/Services", services);
router.get("/Contact", contact);
router.get("/Librarian-Dashboard", librarianDashboard);
router.get("/Login", login);

router.get("/Books", getBooks);
router.get("/Search", searchBooks);
router.get("/BookFilter", filterBooks);

router.post("/View", viewBook);

router.get("/Books/Book/:title", getBook);

export default router;