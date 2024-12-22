import { db } from '../db.js'; // Adjust based on your database setup

// Assign a workout plan to selected members
export const assignWorkoutPlan = async (req, res) => {
  const { workout_plan_id, memberIds } = req.body;

  // Validate request body
  if (!workout_plan_id || !Array.isArray(memberIds) || memberIds.length === 0) {
    return res.status(400).json({ message: 'Workout Plan ID and Member IDs are required.' });
  }

  try {
    // Validate memberIds to ensure no null or invalid values are included
    const validMemberIds = memberIds.filter((id) => id !== null && id !== undefined);

    if (validMemberIds.length === 0) {
      return res.status(400).json({ message: 'No valid member IDs provided.' });
    }

    // Prepare values for bulk insertion
    const values = validMemberIds.map((user_id) => [user_id, workout_plan_id]);

    console.log('Prepared values:', values); // Debug log

    // Insert into the database using a bulk insertion query
    const query = `
      INSERT INTO assigned_workout_plans (user_id, workout_plan_id) VALUES ?
    `;
    await db.query(query, [values]); // Use the `values` array for bulk insertion

    res.status(201).json({ message: 'Workout plan assigned successfully.' });
  } catch (error) {
    console.error('Error assigning workout plan:', error);

    // Handle specific error scenarios
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ message: 'One or more user IDs do not exist.' });
    } else if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Workout plan already assigned to one or more members.' });
    } else if (error.code === 'ER_BAD_NULL_ERROR') {
      return res.status(400).json({ message: 'Invalid member data provided.' });
    }

    res.status(500).json({ message: 'Failed to assign workout plan.' });
  }
};

// Get assigned workout plans for the authenticated user
export const getWorkoutPlansByUserId = async (req, res) => {
  const userId = req.user.id; // Extract the user ID from the request

  // Query to fetch workout plans assigned to the user
  const workoutPlansQuery = `
    SELECT wp.id, wp.name, wp.description
    FROM workout_plans wp
    JOIN assigned_workout_plans awp ON wp.id = awp.workout_plan_id
    WHERE awp.user_id = ?
   
  `;

  try {
    const workoutPlans = await queryAsync(workoutPlansQuery, [userId]);

    // Fetch exercises for each workout plan
    for (const plan of workoutPlans) {
      const exercisesQuery = `
        SELECT e.id, e.name, e.description, wpe.sets, wpe.reps, 
               e.chest, e.back, e.shoulders, e.biceps, e.triceps, e.legs
        FROM workout_plan_exercises wpe
        JOIN exercises e ON wpe.exercise_id = e.id
        WHERE wpe.workout_plan_id = ?;
       
      `;
      const exercises = await queryAsync(exercisesQuery, [plan.id]);
      plan.exercises = exercises; // Attach exercises to the workout plan
    }

    res.status(200).json(workoutPlans);
  } catch (error) {
    console.error('Error fetching assigned workout plans:', error);
    res.status(500).json({ message: 'Failed to fetch assigned workout plans' });
  }
};

// Helper function for database queries
const queryAsync = (query, params) => {
  return new Promise((resolve, reject) => {
    db.query(query, params, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

