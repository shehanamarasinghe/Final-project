// src/App.js
import React from 'react';
import MealPlanForm from '../../Components/Mealplan/MealPlanForm';
import MealPlanList from '../../Components/Mealplan/MealPlanList';
import Slidebar from "../../Components/ADashboardComponents/SlideBar/Slidebar";
import Navbar from '../../Components/ADashboardComponents/Navbar/Navbar';
import AssignMealPlan from '../../Components/Mealplan/AssignMealPlan';
// import CreateWorkOut from './components/CreateWorkOut';

import { MealPlanProvider } from '../../Components/Mealplan/MealPlanProvider';

function MealShedule() {
  return (
    <div className='Adashboard'>
    <Slidebar />
    <div className="ADash-Container">
      <Navbar />
    <MealPlanProvider>
      <div className="min-h-screen bg-gray-100 p-4">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-center text-black">Gym Meal Planner</h1>
        </header>
        <main className="max-w-4xl mx-auto">
          <MealPlanForm />  
          <MealPlanList />
          <AssignMealPlan />
         
        </main>
      </div>
    </MealPlanProvider>
    </div>
    </div>

  );
}

export default MealShedule;
