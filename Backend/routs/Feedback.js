// routes/Feedback.js
import express from 'express';
import { submitFeedback } from '../controllers/Feedbackcontrollers.js';
import { authMiddleware } from "../middleware/authMiddleware.js"; 

const router = express.Router();


// POST route to submit feedback
router.post('/submit', authMiddleware,submitFeedback);

export default router;
