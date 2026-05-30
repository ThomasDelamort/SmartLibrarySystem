import express from 'express';
import {
    admin,
    toggleCanBorrow,
    deleteStudent,
    deleteLibrarian,
    deleteAdminBook,
    addRoom,
    deleteRoom,
    updateRoomStatus,
    downloadDailyLog,
    downloadMonthlyReport,
    chartTrafficData,
    chartReservationData,
} from '../controllers/admin.controller.js';
import { adminAuth } from "../controllers/middleware/auth.middleware.js";

const router = express.Router();


router.get('/Admin', adminAuth, admin);


router.post('/Admin/Students/ToggleBorrow/:id', adminAuth, toggleCanBorrow);
router.post('/Admin/Students/Delete/:id', adminAuth, deleteStudent);

router.post('/Admin/Librarians/Delete/:id', adminAuth, deleteLibrarian);


router.post('/Admin/Books/Delete/:id', adminAuth, deleteAdminBook);

router.post('/Admin', adminAuth, admin)
router.post('/Admin/Rooms/Add', adminAuth, addRoom);
router.post('/Admin/Rooms/Delete/:id', adminAuth, deleteRoom);
router.post('/Admin/Rooms/Status/:id', adminAuth, updateRoomStatus);

router.get('/Admin/Log/Download', adminAuth, downloadDailyLog);
router.get('/Admin/Report/Monthly', adminAuth, downloadMonthlyReport);

router.get('/Admin/Chart/Traffic', adminAuth, chartTrafficData);
router.get('/Admin/Chart/Reservations', adminAuth, chartReservationData);

export default router;