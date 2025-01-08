import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routs/users.js";
import workoutRouts from "./routs/workout.js";
import MealRouts from "./routs/Mealplan.js";
import AdminMeal from "./routs/MealShedule.js";
import scanRoutes from "./routs/Qrscanner.js";
import reminderRoutes from "./routs/reminderRoutes.js";
import attendanceRoutes from './routs/attendanceRoutes.js';
import dotenv from 'dotenv';
import workoutPlanRoutes from './routs/workoutPlanRoutes.js'; 
import exerciseRoutes from './routs/exerciseRoutes.js'; 
import membersRoutes from './routs/members.js';
import mealPlansRoutes from './routs/mealPlans.js';
import mealPlanRequestRoutes from './routs/notificationsRoutes.js';
import notificationsRoutes from './routs/NotipendingRoutes.js';
import membernotificationsRoutes from './routs/MembernotiRoutes.js';
import memberRoutes from "./routs/memberRoutes.js";
//import paymentRoutes from "./routs/payment.js";
import path from "path";
import { fileURLToPath } from "url";
import dashboardwidgetRoutes from './routs/DashboardwidgetRoutes.js';
import assignworkouts from './routs/AssignworkoutPlanRoutes.js';
import feedbackRoutes from './routs/Feedback.js';
import adminfeedbackroutes from './routs/Adminfeedback.js';
import paymentRoutes from "./routs/paymentsRoutes.js";
import adminpayemntroutes from "./routs/AdminpaymentRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/api/workout", workoutRouts);
app.use("/api/AddMemberMeal", MealRouts);
app.use("/api/AdminMeal", AdminMeal);
app.use('/api', scanRoutes);
app.use("/api/reminders", reminderRoutes);
//app.use('/uploads', express.static('uploads'));
app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/workout-plans', workoutPlanRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/getmembers', membersRoutes);
app.use('/api/meal-plans', mealPlansRoutes);
app.use('/api/notifications', mealPlanRequestRoutes);
app.use('/api/pending-notifications', notificationsRoutes);
app.use('/api/member-notifications', membernotificationsRoutes);
app.use('/uploads', express.static(path.join(__dirname, "uploads")));
app.use("/api/members", memberRoutes);
//app.use('/api/pay', paymentRoutes);
app.use('/api/dashboard-widget', dashboardwidgetRoutes);
app.use('/api/assignworkout', assignworkouts);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin/feedback', adminfeedbackroutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/shehan', adminpayemntroutes);




app.listen(5000, () => {
    console.log("Listening on port 5000...");
});
