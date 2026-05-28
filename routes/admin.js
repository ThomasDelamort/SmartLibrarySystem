import express from 'express';
import {
    admin,
    toggleCanBorrow,
    deleteStudent,
    addLibrarian,
    deleteLibrarian,
    deleteAdminBook,
    addRoom,
    deleteRoom,
    updateRoomStatus,
    downloadDailyLog,
} from '../controllers/admin.controller.js';
import { adminAuth } from "../controllers/middleware/auth.middleware.js";

const router = express.Router();


router.get('/Admin', adminAuth, admin);


router.post('/Admin/Students/ToggleBorrow/:id', adminAuth, toggleCanBorrow);
router.post('/Admin/Students/Delete/:id', adminAuth, deleteStudent);


router.post('/Admin/Librarians/Add', adminAuth, addLibrarian);
router.post('/Admin/Librarians/Delete/:id', adminAuth, deleteLibrarian);


router.post('/Admin/Books/Delete/:id', adminAuth, deleteAdminBook);


router.post('/Admin/Rooms/Add', adminAuth, addRoom);
router.post('/Admin/Rooms/Delete/:id', adminAuth, deleteRoom);
router.post('/Admin/Rooms/Status/:id', adminAuth, updateRoomStatus);

router.get('/Admin/Log/Download', adminAuth, downloadDailyLog);

export default router;