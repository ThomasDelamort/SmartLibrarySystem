import express from "express";
import {
    getDashboard,
    chartTraffic,
    chartReservations,
    getStudents,
    toggleCanBorrow,
    deleteStudent,
    getLibrarians,
    deleteLibrarian,
    getBooks,
    deleteBook,
    getRooms,
    addRoom,
    deleteRoom,
    updateRoomStatus,
    getTransactions,
    downloadDailyLog,
    downloadMonthlyReport,
} from "../../controllers/api/admin.api.controller.js";
import { requireAdmin } from "../../controllers/middleware/apiAuth.middleware.js";

const router = express.Router();

router.get("/admin/dashboard", requireAdmin, getDashboard);
router.get("/admin/chart/traffic", requireAdmin, chartTraffic);
router.get("/admin/chart/reservations", requireAdmin, chartReservations);

// Students
router.get("/admin/students", requireAdmin, getStudents);
router.post("/admin/students/:id/toggle-borrow", requireAdmin, toggleCanBorrow);
router.post("/admin/students/:id/delete", requireAdmin, deleteStudent);

// Librarians
router.get("/admin/librarians", requireAdmin, getLibrarians);
router.post("/admin/librarians/:id/delete", requireAdmin, deleteLibrarian);

// Books
router.get("/admin/books", requireAdmin, getBooks);
router.post("/admin/books/:id/delete", requireAdmin, deleteBook);

// Rooms
router.get("/admin/rooms", requireAdmin, getRooms);
router.post("/admin/rooms", requireAdmin, addRoom);
router.post("/admin/rooms/:id/delete", requireAdmin, deleteRoom);
router.post("/admin/rooms/:id/status", requireAdmin, updateRoomStatus);

// Transactions + reports
router.get("/admin/transactions", requireAdmin, getTransactions);
router.get("/admin/log/download", requireAdmin, downloadDailyLog);
router.get("/admin/report/monthly", requireAdmin, downloadMonthlyReport);

export default router;