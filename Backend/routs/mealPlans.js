import express from 'express';
import { assignMealPlan } from '../controllers/mealPlans.js';
import { getMealPlans } from '../controllers/mealPlans.js';
import { getAssignedMealPlans } from '../controllers/mealPlans.js';
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to assign meal plan
router.post('/assign', assignMealPlan);
// Route to get all meal plans
router.get('/checked', getMealPlans);
// Route to get assigned meal plans for a specific member
router.get('/assigned-meal-plans', authMiddleware, getAssignedMealPlans);

export default router;
