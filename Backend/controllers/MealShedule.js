import { db } from "../db.js";

export const getAllFoodItems = (req, res) => {
    const query = `
        SELECT fi.id, fi.food_name, mn.macronutrient_name 
        FROM food_items fi
        JOIN macronutrients mn ON fi.macronutrient_id = mn.id
    `;
    db.query(query, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server Error' });
        }
        res.json(results);
    });
};

export const createFoodItem = (req, res) => {
    const { food_name, macronutrient_id, calories_per_gram, protein_per_gram, carbs_per_gram, vitamin_per_gram } = req.body;
    const query = 'INSERT INTO food_items (food_name, macronutrient_id, calories_per_gram, protein_per_gram, carbs_per_gram, vitamin_per_gram) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [food_name, macronutrient_id, calories_per_gram, protein_per_gram, carbs_per_gram, vitamin_per_gram], (err, result) => {
        if (err) {
            console.error('Error inserting food item:', err);
            return res.status(500).json({ error: 'Failed to add food item.' });
        }
        res.status(200).json({ message: 'Food item added successfully.' });
    });
};

export const getMacronutrients = (req, res) => {
    const query = 'SELECT * FROM macronutrients';
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching macronutrients:', err);
            return res.status(500).json({ error: 'Failed to fetch macronutrients.' });
        }
        res.json(result);
    });
};

export const createMealPlan = (req, res) => {
    const { category_id, meal_type_id, foods } = req.body;
    let totalProtein = 0, totalCarbs = 0, totalVitamins = 0, totalCalories = 0;

    const processFoodItems = (index) => {
        if (index >= foods.length) {
            const mealPlanQuery = 'INSERT INTO meal_plans (category_id, meal_type_id, total_protein, total_carbs, total_vitamins, total_calories) VALUES (?, ?, ?, ?, ?, ?)';
            db.query(mealPlanQuery, [category_id, meal_type_id, totalProtein, totalCarbs, totalVitamins, totalCalories], (err, mealPlanResult) => {
                if (err) {
                    console.error('Error inserting meal plan:', err);
                    return res.status(500).json({ message: 'Server Error' });
                }
                const meal_plan_id = mealPlanResult.insertId;
                const mealPlanItems = foods.map(food => [meal_plan_id, food.food_item_id, food.grams]);
                const mealPlanItemQuery = 'INSERT INTO meal_plan_items (meal_plan_id, food_item_id, grams) VALUES ?';
                db.query(mealPlanItemQuery, [mealPlanItems], (err) => {
                    if (err) {
                        console.error('Error inserting meal plan items:', err);
                        return res.status(500).json({ message: 'Server Error' });
                    }
                    res.status(201).json({ message: 'Meal plan created successfully', meal_plan_id });
                });
            });
            return;
        }

        const { food_item_id, grams } = foods[index];
        db.query('SELECT * FROM food_items WHERE id = ?', [food_item_id], (error, rows) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Server Error' });
            }
            if (rows.length === 0) {
                return res.status(400).json({ message: 'Food item not found' });
            }

            const foodItem = rows[0];
            totalProtein += foodItem.protein_per_gram * grams;
            totalCarbs += foodItem.carbs_per_gram * grams;
            totalVitamins += foodItem.vitamin_per_gram * grams;
            totalCalories += foodItem.calories_per_gram * grams;

            processFoodItems(index + 1);
        });
    };

    processFoodItems(0);
};

export const getMealPlanById = (req, res) => {
    const mealPlanId = req.params.id;
    const mealPlanQuery = `
        SELECT mp.*, c.category_name, mt.meal_type 
        FROM meal_plans mp
        JOIN categories c ON mp.category_id = c.id
        JOIN meal_types mt ON mp.meal_type_id = mt.id
        WHERE mp.id = ?
    `;
    db.query(mealPlanQuery, [mealPlanId], (error, mealPlanRows) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server Error' });
        }
        if (mealPlanRows.length === 0) {
            return res.status(404).json({ message: 'Meal plan not found' });
        }

        const mealPlan = mealPlanRows[0];
        const mealPlanItemsQuery = `
            SELECT mpi.grams, fi.food_name, fi.protein_per_gram, fi.carbs_per_gram, fi.vitamin_per_gram, fi.calories_per_gram
            FROM meal_plan_items mpi
            JOIN food_items fi ON mpi.food_item_id = fi.id
            WHERE mpi.meal_plan_id = ?
        `;
        db.query(mealPlanItemsQuery, [mealPlanId], (error, items) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Server Error' });
            }
            res.json({ mealPlan, items });
        });
    });
};

export const getAllMealPlans = (req, res) => {
    const query = `
        SELECT mp.id, c.category_name, mt.meal_type, mp.date_created
        FROM meal_plans mp
        JOIN categories c ON mp.category_id = c.id
        JOIN meal_types mt ON mp.meal_type_id = mt.id
        ORDER BY mp.date_created DESC
    `;
    db.query(query, (error, mealPlans) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server Error' });
        }
        res.json(mealPlans);
    });
};

export const deleteMealPlan = (req, res) => {
    const mealPlanId = req.params.id;
    const deleteItemsQuery = 'DELETE FROM meal_plan_items WHERE meal_plan_id = ?';
    const deleteMealPlanQuery = 'DELETE FROM meal_plans WHERE id = ?';

    db.query(deleteItemsQuery, [mealPlanId], (error) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server Error' });
        }
        db.query(deleteMealPlanQuery, [mealPlanId], (error) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Server Error' });
            }
            res.status(200).json({ message: 'Meal plan deleted successfully' });
        });
    });
};
