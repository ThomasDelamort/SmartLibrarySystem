import express from "express";
import { listBooks, getBookByTitle, downloadBookPdf } from "../../controllers/api/books.api.controller.js";

const router = express.Router();

router.get("/books", listBooks);
router.get("/books/:id/pdf", downloadBookPdf);
router.get("/books/:title", getBookByTitle);

export default router;