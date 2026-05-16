import express from 'express';
import { admin } from '../controllers/admin.controller.js';

const router = express.Router();

router.get('/Admin', admin);

export default router;
