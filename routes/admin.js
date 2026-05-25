import express from 'express';
import { admin } from '../controllers/admin.controller.js';
import { adminAuth } from "../controllers/middleware/auth.middleware.js";


const router = express.Router();
router.get('/Admin', adminAuth, admin);


export default router;
