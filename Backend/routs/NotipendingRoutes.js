import express from 'express';
import { getAllMealPlanRequests,updateMealPlanRequestStatus,getNotificationCount } from '../controllers/Notipending.js';
const router = express.Router();
import { authMiddleware } from "../middleware/authMiddleware.js";


router.get('/notification/count', getNotificationCount);
router.get('/meal-plan-requests',authMiddleware, getAllMealPlanRequests);
router.patch('/meal-plan-requests/:id', authMiddleware, updateMealPlanRequestStatus);






export default router;