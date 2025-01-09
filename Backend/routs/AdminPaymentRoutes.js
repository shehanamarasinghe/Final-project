// routes/payment.js
import express from 'express';
import {   getAllPayments,   getDashboardStats,   getChartData,  approvePayment,  rejectPayment,  generateReport} from '../controllers/AdminpaymentController.js';

const router = express.Router();

// Get all payment slips
router.get("/payment-slips", getAllPayments);

// Get dashboard statistics
router.get("/dashboard/stats", getDashboardStats);

// Get chart data
router.get("/dashboard/charts", getChartData);

// Approve payment
router.post("/payment-slips/:id/approve", approvePayment);

// Reject payment
router.post("/payment-slips/:id/reject", rejectPayment);

// Generate payment report
//router.get("/reports/generate", generateReport);

router.post('/reports/generate', generateReport);

export default router;