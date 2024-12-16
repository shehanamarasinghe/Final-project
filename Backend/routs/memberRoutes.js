import express from "express";
import {getProfile,updateProfile} from "../controllers/memberController.js";
import { authMiddleware } from "../middleware/authMiddleware.js"; 
import {upload} from "../uploadConfig.js";


const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.put("/update-profile", authMiddleware, upload.single("profilePicture"), updateProfile);

export default router;
