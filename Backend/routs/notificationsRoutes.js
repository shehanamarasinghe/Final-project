import express from 'express';
import { createMealPlanRequest,updateMealPlanRequestStatus,getMealPlanRequestsByStatus,} from '../controllers/notificationsController.js';
const router = express.Router();
import { authMiddleware } from "../middleware/authMiddleware.js";


router.post('/meal-plan-requests',authMiddleware, createMealPlanRequest);
router.patch('/meal-plan-requests/:id', authMiddleware, updateMealPlanRequestStatus);
router.get('/meal-plan-requests', authMiddleware, getMealPlanRequestsByStatus);


export default router;