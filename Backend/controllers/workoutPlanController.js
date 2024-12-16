import { db } from '../db.js';
// Helper function to wrap db.query in a Promise for async/await usage
const queryAsync = (query, params) => {
  return new Promise((resolve, reject) => {
    db.query(query, params, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

// Validate if all exercise IDs exist in the database
const validateExerciseIds = async (exerciseIds) => {
  const query = 'SELECT id FROM exercises WHERE id IN (?)';
  const rows = await queryAsync(query, [exerciseIds]);

  // If some exercise IDs are invalid (not found in the database)
  if (rows.length !== exerciseIds.length) {
    throw new Error('One or more exercise IDs are invalid.');
  }

  return rows;
};

// Create a new workout plan
export const createWorkoutPlan = async (req, res) => {
  const { name, description, exercises } = req.body;

  // Validate the request data
  if (!name || !exercises || exercises.length === 0) {
    return res.status(400).json({ message: 'Please provide a name and at least one exercise.' });
  }

  try {
    // Extract the exercise IDs from the request body
    const exerciseIds = exercises.map(ex => ex.id);

    // Validate exercise IDs to ensure they exist in the database
    await validateExerciseIds(exerciseIds);

    // Start the transaction
    await queryAsync('START TRANSACTION');

    // Insert the workout plan into the `workout_plans` table
    const workoutPlanQuery = 'INSERT INTO workout_plans (name, description) VALUES (?, ?)';
    const workoutPlanResult = await queryAsync(workoutPlanQuery, [name, description]);

    // Get the inserted workout plan ID
    const workoutPlanId = workoutPlanResult.insertId;

    // Prepare the values to insert into `workout_plan_exercises`
    const workoutPlanExercisesQuery = `
      INSERT INTO workout_plan_exercises (workout_plan_id, exercise_id, sets, reps) VALUES ?
    `;
    const exerciseValues = exercises.map(ex => [workoutPlanId, ex.id, ex.sets, ex.reps]);

    // Insert into `workout_plan_exercises`
    await queryAsync(workoutPlanExercisesQuery, [exerciseValues]);

    // Commit the transaction
    await queryAsync('COMMIT');

    // Success response
    res.status(201).json({ message: 'Workout plan created successfully', workoutPlanId });
  } catch (err) {
    // Rollback in case of error
    await queryAsync('ROLLBACK');
    console.error('Error creating workout plan:', err);
    res.status(500).json({ message: 'Failed to create workout plan due to an internal error.' });
  }
};



// Get all workout plans
export const getAllWorkoutPlans = async (req, res) => {
  const query = `
    SELECT wp.id AS workout_plan_id, wp.name AS workout_plan_name, wp.description AS workout_plan_description, wp.created_at,
           wpe.exercise_id, ex.name AS exercise_name, ex.description AS exercise_description,
           wpe.sets, wpe.reps,
           ex.chest, ex.back, ex.shoulders, ex.biceps, ex.triceps, ex.legs
    FROM workout_plans wp
    LEFT JOIN workout_plan_exercises wpe ON wp.id = wpe.workout_plan_id
    LEFT JOIN exercises ex ON wpe.exercise_id = ex.id
    ORDER BY wp.id
  `;

  try {
    db.query(query, (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      const workoutPlansMap = {};
      result.forEach(row => {
        if (!workoutPlansMap[row.workout_plan_id]) {
          workoutPlansMap[row.workout_plan_id] = {
            id: row.workout_plan_id,
            name: row.workout_plan_name,
            description: row.workout_plan_description,
            created_at: row.created_at,
            exercises: []
          };
        }

        workoutPlansMap[row.workout_plan_id].exercises.push({
          id: row.exercise_id,
          name: row.exercise_name,
          description: row.exercise_description,
          sets: row.sets,
          reps: row.reps,
          chest: row.chest,
          back: row.back,
          shoulders: row.shoulders,
          biceps: row.biceps,
          triceps: row.triceps,
          legs: row.legs
        });
      });

      const workoutPlans = Object.values(workoutPlansMap);
      res.status(200).json(workoutPlans);
    });
  } catch (err) {
    console.error('Error fetching workout plans:', err);
    res.status(500).json({ message: 'Failed to fetch workout plans' });
  }
};

// Update a workout plan
export const updateWorkoutPlan = async (req, res) => {
  const { id } = req.params;
  const { name, description, exercises } = req.body;

  if (!name || !exercises || exercises.length === 0) {
    return res.status(400).json({ message: 'Please provide a name and at least one exercise.' });
  }

  try {
    const exerciseIds = exercises.map(ex => ex.id);
    await validateExerciseIds(exerciseIds);

    await db.query('START TRANSACTION');

    const updatePlanQuery = 'UPDATE workout_plans SET name = ?, description = ? WHERE id = ?';
    await db.query(updatePlanQuery, [name, description, id]);

    const deleteExercisesQuery = 'DELETE FROM workout_plan_exercises WHERE workout_plan_id = ?';
    await db.query(deleteExercisesQuery, [id]);

    const insertExercisesQuery = 'INSERT INTO workout_plan_exercises (workout_plan_id, exercise_id, sets, reps) VALUES ?';
    const exerciseValues = exercises.map(ex => [id, ex.id, ex.sets, ex.reps]);
    await db.query(insertExercisesQuery, [exerciseValues]);

    await db.query('COMMIT');
    res.status(200).json({ message: 'Workout plan updated successfully' });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error('Error updating workout plan:', err);
    res.status(500).json({ message: 'Failed to update workout plan' });
  }
};

// Delete a workout plan
export const deleteWorkoutPlan = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('START TRANSACTION');

    const deleteExercisesQuery = 'DELETE FROM workout_plan_exercises WHERE workout_plan_id = ?';
    await db.query(deleteExercisesQuery, [id]);

    const deletePlanQuery = 'DELETE FROM workout_plans WHERE id = ?';
    await db.query(deletePlanQuery, [id]);

    await db.query('COMMIT');
    res.status(200).json({ message: 'Workout plan deleted successfully' });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error('Error deleting workout plan:', err);
    res.status(500).json({ message: 'Failed to delete workout plan' });
  }
};
