// routes/reminderRoutes.js
import express from "express";
import { getReminders, createReminder, updateReminder, deleteReminder } from "../controllers/reminderController.js";
import { authMiddleware } from "../middleware/authMiddleware.js"; // Import authMiddleware

const router = express.Router();

router.get("/getreminder", authMiddleware, getReminders);
router.post("/postreminders", authMiddleware, createReminder);
router.put("/putreminders/:id", authMiddleware, updateReminder);
router.delete("/Deletereminders/:id", authMiddleware, deleteReminder);

export default router;
