import express from "express";
import { login, me, logout } from "../../controllers/api/auth.api.controller.js";
import { requireAuth } from "../../controllers/middleware/apiAuth.middleware.js";

const router = express.Router();

router.post("/login", login);
router.get("/me", me);
router.post("/logout", requireAuth, logout);

export default router;