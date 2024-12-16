import { db } from '../db.js';

// Get all meal plans
export const getMealPlans = (req, res) => {
  const query = 'SELECT id, category_name, meal_type FROM meal_plans';

  db.query(query, (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json(result);
  });
};

// Function to assign meal plan to a member
export const assignMealPlan = async (req, res) => {
  const { userid, meal_plan_id } = req.body;

  // Check if userid and meal_plan_id are provided
  if (!userid || !meal_plan_id) {
    return res.status(400).json({ message: 'User ID and Meal Plan ID are required.' });
  }

  try {
    // Insert into the assigned_meal_plans table
    const query = 'INSERT INTO assigned_meal_plans (userid, meal_plan_id) VALUES (?, ?)';
    await queryAsync(query, [userid, meal_plan_id]);

    res.status(201).json({ message: 'Meal plan assigned to member successfully.' });
  } catch (err) {
    console.error('Error assigning meal plan:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};



// Function to get assigned meal plans for a member

export const getAssignedMealPlans = (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT mp.id, mp.category_id, mp.meal_type_id, 
           mp.date_created, mp.total_carbs, mp.total_protein, 
           mp.total_vitamins, mp.total_calories 
    FROM meal_plans mp 
    JOIN assigned_meal_plans amp ON mp.id = amp.meal_plan_id 
    WHERE amp.userid = ? 
    ORDER BY mp.date_created DESC;
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json(results);
  });
};

const queryAsync = (query, params) => {
  return new Promise((resolve, reject) => {
    db.query(query, params, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};