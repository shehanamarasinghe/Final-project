import express from 'express';
import { getSubscription, getPaymentHistory, submitPayment } from '../controllers/paymentController.js';
import { authMiddleware } from "../middleware/authMiddleware.js"; 

const router = express.Router();

router.get('/reddamption', authMiddleware, getSubscription);
router.get('/history', authMiddleware, getPaymentHistory);
router.post('/submit', authMiddleware, submitPayment);


export default router;