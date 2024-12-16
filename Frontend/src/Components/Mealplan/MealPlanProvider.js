// src/components/MealPlanProvider.js
import React, { createContext, useState } from 'react';

export const MealPlanContext = createContext();

export const MealPlanProvider = ({ children }) => {
    const [mealPlans, setMealPlans] = useState([]);

    const addMealPlan = (mealPlan) => {
        setMealPlans([...mealPlans, mealPlan]);
    };

    return (
        <MealPlanContext.Provider value={{ mealPlans, addMealPlan }}>
            {children}
        </MealPlanContext.Provider>
    );
};
