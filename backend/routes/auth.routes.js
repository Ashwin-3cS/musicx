import express from "express";
import { profile } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/profile", profile);

// router.post("/login", login);
// router.post("/logout", logout);

export default router;
