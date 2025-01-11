import { db } from '../db.js'; // Ensure this is correctly configured

export const getAssignedMealPlans = async (req, res) => {
  const userId = req.user.id;

  console.log('User ID:', userId); // Log the user ID

  const mealPlansQuery = `
    SELECT mp.id AS meal_plan_id, mp.total_protein, mp.total_carbs, mp.total_vitamins, mp.total_calories, mp.date_created, c.category_name
    FROM meal_plans mp
    JOIN assigned_meal_plans amp ON mp.id = amp.meal_plan_id
    JOIN categories c ON mp.category_id = c.id
    WHERE amp.userid = ?
  `;

  try {
    const mealPlans = await new Promise((resolve, reject) => {
      db.query(mealPlansQuery, [userId], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });

    console.log('Meal Plans Query Result:', mealPlans);

    for (const plan of mealPlans) {
      const foodItemsQuery = `
        SELECT fi.id, fi.food_name, mpi.grams, fi.calories_per_gram, fi.protein_per_gram, fi.carbs_per_gram, fi.vitamin_per_gram
        FROM meal_plan_items mpi
        JOIN food_items fi ON mpi.food_item_id = fi.id
        WHERE mpi.meal_plan_id = ?;
      `;
      const foodItems = await new Promise((resolve, reject) => {
        db.query(foodItemsQuery, [plan.meal_plan_id], (error, results) => {
          if (error) return reject(error);
          resolve(results);
        });
      });
      plan.foodItems = foodItems;
    }

    res.status(200).json(mealPlans);
  } catch (error) {
    console.error('Error fetching assigned meal plans:', error.message);
    res.status(500).json({ message: 'Failed to fetch assigned meal plans' });
  }
};