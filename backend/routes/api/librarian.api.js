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
    getStudents,
    getManualOptions,
    getStudentBorrowed,
    manualTransaction,
    settleFines,
    getLibrarianProfile,
    updateLibrarianProfile,
    changeLibrarianPassword,
    uploadLibrarianProfilePicture,
} from "../../controllers/api/librarian.api.controller.js";
import { requireLibrarian } from "../../controllers/middleware/apiAuth.middleware.js";
import { upload, uploadProfile } from "../../controllers/middleware/upload.middleware.js";

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

// Students
router.get("/librarian/students", requireLibrarian, getStudents);
router.get("/librarian/students/:id/borrowed", requireLibrarian, getStudentBorrowed);

// Manual transactions + settle fines
router.get("/librarian/manual/options", requireLibrarian, getManualOptions);
router.post("/librarian/transactions/manual", requireLibrarian, manualTransaction);
router.post("/librarian/transactions/settle-fines", requireLibrarian, settleFines);

// Profile
router.get("/librarian/profile", requireLibrarian, getLibrarianProfile);
router.post("/librarian/profile/update", requireLibrarian, updateLibrarianProfile);
router.post("/librarian/profile/password", requireLibrarian, changeLibrarianPassword);
router.post("/librarian/profile/picture", requireLibrarian, uploadProfile.single("profilePicture"), uploadLibrarianProfilePicture);

export default router;