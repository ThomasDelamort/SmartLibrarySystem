import express from "express";
import { dashboard, logout } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/Dashboard", dashboard);
router.get("/LogOut", logout);

export default router;