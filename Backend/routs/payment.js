import express from "express";
import {createPaymentIntent,updatePaymentStatus,getTransactionHistory,getPayments,getFinancialMetrics,getMembershipMetrics,} from "../controllers/createPaymentIntent.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-payment-intent", authMiddleware, createPaymentIntent);
router.post("/update-payment-status", authMiddleware, updatePaymentStatus);
router.get("/transaction-history", authMiddleware, getTransactionHistory);
router.get("/payments", authMiddleware, getPayments);
router.get("/financial-metrics", authMiddleware, getFinancialMetrics);
router.get("/membership-metrics", authMiddleware, getMembershipMetrics);

export default router;
