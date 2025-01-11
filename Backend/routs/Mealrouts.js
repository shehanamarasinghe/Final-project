import express from 'express';
import { getAssignedMealPlans } from '../controllers/Assignmealplan.js';
import { authMiddleware } from '../middleware/authMiddleware.js';


const router = express.Router();

// Route to get assigned meal plans for the authenticated user
router.get('/meal-plans', authMiddleware, getAssignedMealPlans);

export default router;