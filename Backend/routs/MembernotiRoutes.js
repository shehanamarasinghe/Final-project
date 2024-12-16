import express from 'express';
import { getMemberNotifications } from "../controllers/MembernotiController.js";
const router = express.Router();
import { authMiddleware } from "../middleware/authMiddleware.js";




router.get('/member', authMiddleware, getMemberNotifications);

export default router;