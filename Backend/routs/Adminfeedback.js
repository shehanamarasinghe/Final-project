import express from 'express';
import {getFeedbackStats,getRecentFeedbacks,getFeedbackStatsByPlan } from '../controllers/AdminfeedbackController.js';
//import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes should be protected with admin middleware
router.get('/stats',getFeedbackStats);
router.get('/recent',getRecentFeedbacks);
router.get('/stats/plans',getFeedbackStatsByPlan);


export default router;