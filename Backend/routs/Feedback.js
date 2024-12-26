import express from 'express';
import { submitFeedback } from '../controllers/Feedbackcontrollers.js';


const router = express.Router();

// POST route to submit feedback
router.post('/submit', submitFeedback);

export default router;
