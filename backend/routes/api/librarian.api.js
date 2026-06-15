import express from "express";
import {
    getNotifications,
    markNotificationRead,
    clearAllNotifications,
    getTransactions,
    approveBookTransaction,
    rejectBookTransaction,
    confirmReturn,
    approveRoomTransaction,
    rejectRoomTransaction,
    getBooks,
    addBook,
    editBook,
    deleteBook,
} from "../../controllers/api/librarian.api.controller.js";
import { requireLibrarian } from "../../controllers/middleware/apiAuth.middleware.js";
import { upload } from "../../controllers/middleware/upload.middleware.js";

const router = express.Router();

// Cover image + optional PDF, both to S3.
const bookUpload = upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
]);

// Notifications
router.get("/librarian/notifications", requireLibrarian, getNotifications);
router.post("/librarian/notifications/read/:id", requireLibrarian, markNotificationRead);
router.post("/librarian/notifications/clear", requireLibrarian, clearAllNotifications);

// Transactions
router.get("/librarian/transactions", requireLibrarian, getTransactions);
router.post("/librarian/transactions/approve/:id", requireLibrarian, approveBookTransaction);
router.post("/librarian/transactions/reject/:id", requireLibrarian, rejectBookTransaction);
router.post("/librarian/transactions/return/:id", requireLibrarian, confirmReturn);
router.post("/librarian/transactions/room/approve/:id", requireLibrarian, approveRoomTransaction);
router.post("/librarian/transactions/room/reject/:id", requireLibrarian, rejectRoomTransaction);

// Books (the EJS had a duplicate Edit handler + delete jammed on one line — cleaned up here)
router.get("/librarian/books", requireLibrarian, getBooks);
router.post("/librarian/books", requireLibrarian, bookUpload, addBook);
router.post("/librarian/books/:id", requireLibrarian, bookUpload, editBook);
router.post("/librarian/books/:id/delete", requireLibrarian, deleteBook);

export default router;