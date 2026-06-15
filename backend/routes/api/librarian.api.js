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
} from "../../controllers/api/librarian.api.controller.js";
import { requireLibrarian } from "../../controllers/middleware/apiAuth.middleware.js";

const router = express.Router();

router.get("/librarian/notifications", requireLibrarian, getNotifications);
router.post("/librarian/notifications/read/:id", requireLibrarian, markNotificationRead);
router.post("/librarian/notifications/clear", requireLibrarian, clearAllNotifications);

router.get("/librarian/transactions", requireLibrarian, getTransactions);
router.post("/librarian/transactions/approve/:id", requireLibrarian, approveBookTransaction);
router.post("/librarian/transactions/reject/:id", requireLibrarian, rejectBookTransaction);
router.post("/librarian/transactions/return/:id", requireLibrarian, confirmReturn);
router.post("/librarian/transactions/room/approve/:id", requireLibrarian, approveRoomTransaction);
router.post("/librarian/transactions/room/reject/:id", requireLibrarian, rejectRoomTransaction);

export default router;