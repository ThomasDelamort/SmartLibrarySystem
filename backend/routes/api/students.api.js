import express from "express";
import {
    toggleLike,
    borrowBook,
    addToBag,
    getBag,
    removeFromBag,
    borrowFromBag,
    getBorrowed,
    returnBook,
} from "../../controllers/api/students.api.controller.js";
import { requireStudent } from "../../controllers/middleware/apiAuth.middleware.js";

const router = express.Router();

router.post("/students/like/:bookId", requireStudent, toggleLike);
router.post("/students/borrow", requireStudent, borrowBook);

router.get("/students/bag", requireStudent, getBag);
router.post("/students/bag", requireStudent, addToBag);
router.post("/students/bag/remove/:bookId", requireStudent, removeFromBag);
router.post("/students/bag/borrow-all", requireStudent, borrowFromBag);

router.get("/students/borrowed", requireStudent, getBorrowed);
router.post("/students/return", requireStudent, returnBook);

export default router;