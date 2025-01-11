import express from 'express';
import { submitFeedback,getPlanReviews,getPlanRatings} from '../controllers/MealFeedback.js';
import { authMiddleware } from "../middleware/authMiddleware.js"; 


const router = express.Router();


// POST route to submit feedback
router.get('/plan-reviews/:planId', authMiddleware, getPlanReviews);
router.post('/submit', authMiddleware,submitFeedback);
router.get('/plan-ratings', authMiddleware,getPlanRatings);

export default router;