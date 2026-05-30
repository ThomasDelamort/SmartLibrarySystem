import express from "express";

import {
    getStudents,
    filterStudentBooks,
    searchStudentBooks,
    submitBook,
    getStudentBook,
    getBorrowedBooks,
    returnBook,
    markNotificationRead,
    getRooms,
    reserveRoom,
    getReservations,
    cancelReservation,
    getStatus,
    getHistory,
    toggleLike,
    getLikedBooks,
    searchStudents,
    getStudentProfile,
    updateStudentProfile,
    changeStudentPassword,
    uploadStudentProfilePicture
} from "../controllers/student.controller.js";
import { getBag, addToBag, removeFromBag, borrowFromBag } from "../controllers/Bag.controller.js";
import { studentAuth, userAuth } from "../controllers/middleware/auth.middleware.js";
import { upload, uploadProfile } from "../controllers/middleware/upload.middleware.js";

const router = express.Router();

router.get("/Students", studentAuth, getStudents);
router.get("/Filter", studentAuth, filterStudentBooks);
router.get("/Search-Book", studentAuth, searchStudentBooks);
router.post("/Submit", studentAuth, submitBook);
router.get("/Students/Book/:title", studentAuth, getStudentBook);
router.get("/Students/Borrowed", studentAuth, getBorrowedBooks);
router.post("/Students/Return", studentAuth, returnBook);
router.post("/Notifications/Read/:id", studentAuth, markNotificationRead);


router.get("/Students/Rooms", studentAuth, getRooms);
router.post("/Students/Rooms/Reserve", studentAuth, reserveRoom);


router.get("/Students/Reservations", studentAuth, getReservations);
router.post("/Students/Reservation/Cancel/:id", studentAuth, cancelReservation);


router.get("/Students/Status", studentAuth, getStatus);
router.get("/Students/History", studentAuth, getHistory);


router.get("/Students/Bag", studentAuth, getBag);
router.post("/Students/Bag/Add", studentAuth, addToBag);
router.post("/Students/Bag/Remove/:bookId", studentAuth, removeFromBag);
router.post("/Students/Bag/BorrowAll", studentAuth, borrowFromBag);

router.post("/Students/Like/:bookId", studentAuth, toggleLike);
router.get("/Students/Liked", studentAuth, getLikedBooks);

router.get("/Students/Profile", studentAuth, getStudentProfile);
router.post("/Students/Profile/Update", studentAuth, updateStudentProfile);
router.post("/Students/Profile/ChangePassword", studentAuth, changeStudentPassword);

router.post("/Students/Profile/Picture", studentAuth, uploadProfile.single("profilePicture"), uploadStudentProfilePicture)

router.get("/Students/Search", userAuth, searchStudents);


export default router;