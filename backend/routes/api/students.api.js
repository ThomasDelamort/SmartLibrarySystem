import express from "express";
import { toggleLike, borrowBook, addToBag } from "../../controllers/api/students.api.controller.js";
import { requireStudent } from "../../controllers/middleware/apiAuth.middleware.js";

const router = express.Router();

router.post("/students/like/:bookId", requireStudent, toggleLike);
router.post("/students/borrow", requireStudent, borrowBook);
router.post("/students/bag", requireStudent, addToBag);

export default router;