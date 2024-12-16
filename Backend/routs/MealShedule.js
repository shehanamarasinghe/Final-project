import express from "express";
import { getAllFoodItems, createFoodItem, getMacronutrients, createMealPlan, getMealPlanById, getAllMealPlans, deleteMealPlan } from '../controllers/MealShedule.js';

const router = express.Router();


router.get('/food-items', getAllFoodItems);
router.post('/food-items', createFoodItem);
router.get('/food-items/macronutrients', getMacronutrients);
router.post('/meal-plans/create-meal-plan', createMealPlan);
router.get('/meal-plans/:id', getMealPlanById);
router.get('/meal-plans', getAllMealPlans); 
router.delete('/meal-plans/:id', deleteMealPlan);

export default router;
