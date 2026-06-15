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
    getProfile,
    updateProfile,
    changePassword,
    uploadProfilePicture,
    getRooms,
    reserveRoom,
    getReservations,
    cancelReservation,
    searchStudents,
    getLiked,
    getHistory,
    getStatus,
    getStudentNotifications,
    markStudentNotificationRead,
    clearStudentNotifications,
} from "../../controllers/api/students.api.controller.js";
import { requireStudent } from "../../controllers/middleware/apiAuth.middleware.js";
import { uploadProfile } from "../../controllers/middleware/upload.middleware.js";

const router = express.Router();

router.post("/students/like/:bookId", requireStudent, toggleLike);
router.get("/students/liked", requireStudent, getLiked);
router.get("/students/history", requireStudent, getHistory);
router.get("/students/status", requireStudent, getStatus);

router.get("/students/notifications", requireStudent, getStudentNotifications);
router.post("/students/notifications/read/:id", requireStudent, markStudentNotificationRead);
router.post("/students/notifications/clear", requireStudent, clearStudentNotifications);
router.post("/students/borrow", requireStudent, borrowBook);

router.get("/students/bag", requireStudent, getBag);
router.post("/students/bag", requireStudent, addToBag);
router.post("/students/bag/remove/:bookId", requireStudent, removeFromBag);
router.post("/students/bag/borrow-all", requireStudent, borrowFromBag);

router.get("/students/borrowed", requireStudent, getBorrowed);
router.post("/students/return", requireStudent, returnBook);

router.get("/students/profile", requireStudent, getProfile);
router.post("/students/profile", requireStudent, updateProfile);
router.post("/students/profile/password", requireStudent, changePassword);
router.post("/students/profile/picture", requireStudent, uploadProfile.single("profilePicture"), uploadProfilePicture);

router.get("/students/rooms", requireStudent, getRooms);
router.post("/students/rooms/reserve", requireStudent, reserveRoom);
router.get("/students/reservations", requireStudent, getReservations);
router.post("/students/reservations/cancel/:id", requireStudent, cancelReservation);
router.get("/students/search", requireStudent, searchStudents);

export default router;