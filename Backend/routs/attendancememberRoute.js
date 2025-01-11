// routes/attendance.js
import express from 'express';
import { getAttendance, checkIn, checkOut, getStats } from '../controllers/attendancememberController.js';
import { authMiddleware } from "../middleware/authMiddleware.js"; 
const router = express.Router();


router.get('/attendance', authMiddleware, getAttendance);
router.post('/attendance/check-in',authMiddleware , checkIn);
router.post('/attendance/check-out',authMiddleware , checkOut);
router.get('/attendance/stats',authMiddleware , getStats);

export default router;