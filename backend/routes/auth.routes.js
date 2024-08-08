import express from "express";
import { profile,profileDetails} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/profile", profile);
router.get("/profile-details",profileDetails)

// router.post("/login", login);
// router.post("/logout", logout);

export default router;
