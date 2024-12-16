import express from "express";
import { AddMeal, Meal, upl, upload } from "../controllers/Mealplan.js";

const router = express.Router();

router.post("/", AddMeal);
router.post("/meal", Meal);
router.post("/upload", upload, upl); 

export default router;
