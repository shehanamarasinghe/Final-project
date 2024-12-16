import { db } from "../db.js";

// GET all exercises
export const getAllExercises = async (req, res) => {
  const query = 'SELECT * FROM exercises';

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json(result);
  });
};

// POST create a new exercise
export const createExercise = async (req, res) => {
  const { name, description, chest, back, shoulders, biceps, triceps, legs } = req.body;
  const query = 'INSERT INTO exercises (name, description, chest, back, shoulders, biceps, triceps, legs) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

  db.query(query, [name, description, chest, back, shoulders, biceps, triceps, legs], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(201).json({ message: 'Exercise created' });
  });
};

// PUT update an exercise
export const updateExercise = async (req, res) => {
  const { id } = req.params;
  const { name, description, chest, back, shoulders, biceps, triceps, legs } = req.body;
  const query = 'UPDATE exercises SET name = ?, description = ?, chest = ?, back = ?, shoulders = ?, biceps = ?, triceps = ?, legs = ? WHERE id = ?';

  db.query(query, [name, description, chest, back, shoulders, biceps, triceps, legs, id], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json({ message: 'Exercise updated' });
  });
};

// DELETE an exercise
export const deleteExercise = async (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM exercises WHERE id = ?';

  db.query(query, [id], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json({ message: 'Exercise deleted' });
  });
};
