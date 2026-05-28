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
    updateRoomStatus
} from '../controllers/admin.controller.js';
import { adminAuth } from "../controllers/middleware/auth.middleware.js";

const router = express.Router();

// Dashboard + all sections
router.get('/Admin', adminAuth, admin);

// Students
router.post('/Admin/Students/ToggleBorrow/:id', adminAuth, toggleCanBorrow);
router.post('/Admin/Students/Delete/:id', adminAuth, deleteStudent);

// Librarians
router.post('/Admin/Librarians/Add', adminAuth, addLibrarian);
router.post('/Admin/Librarians/Delete/:id', adminAuth, deleteLibrarian);

// Books
router.post('/Admin/Books/Delete/:id', adminAuth, deleteAdminBook);

// Rooms
router.post('/Admin/Rooms/Add', adminAuth, addRoom);
router.post('/Admin/Rooms/Delete/:id', adminAuth, deleteRoom);
router.post('/Admin/Rooms/Status/:id', adminAuth, updateRoomStatus);

export default router;