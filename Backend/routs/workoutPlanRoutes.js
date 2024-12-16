import express from 'express';
import { createWorkoutPlan, getAllWorkoutPlans, updateWorkoutPlan, deleteWorkoutPlan } from '../controllers/workoutPlanController.js';

const router = express.Router();

router.post('/', createWorkoutPlan);
router.get('/', getAllWorkoutPlans);
router.put('/:id', updateWorkoutPlan);
router.delete('/:id', deleteWorkoutPlan);

export default router;
