import express from 'express';
import { markAttendance, getAttendanceCount, getWeeklyAttendanceCount, getDailyAttendanceForWeek } from '../controllers/attendanceController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/mark', authMiddleware, markAttendance);
router.get('/count', authMiddleware, getAttendanceCount);
router.get('/weekly-count', authMiddleware, getWeeklyAttendanceCount);
router.get('/daily-attendance', authMiddleware, getDailyAttendanceForWeek);


export default router;
