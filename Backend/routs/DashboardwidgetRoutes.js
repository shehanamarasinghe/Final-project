import express from "express";
import { getLiveAttendanceCount,getRegisteredMembersCount } from'../controllers/DashboardController.js';
const router = express.Router();
// Route to get live attendance count
router.get('/live-count', getLiveAttendanceCount);
router.get('/count', getRegisteredMembersCount);

export default router;
