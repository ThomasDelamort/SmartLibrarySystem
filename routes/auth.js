import express from "express";
import { dashboard } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/Dashboard", dashboard);

export default router;