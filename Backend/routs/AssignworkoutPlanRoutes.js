import express from 'express';
import { assignWorkoutPlan, getWorkoutPlansByUserId } from '../controllers/AssignworkoutPlanController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to assign a workout plan to members
router.post('/assign', assignWorkoutPlan);

// Route to get assigned plans for members
router.get('/assigned-plans', authMiddleware, getWorkoutPlansByUserId);

export default router;
