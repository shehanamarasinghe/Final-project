// controllers/reminderController.js
import { db } from "../db.js";

// GET all reminders for a specific user
export const getReminders = (req, res) => {
  const { id: userId } = req.user; // Extract userId from req.user

  db.query('SELECT * FROM reminders WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching reminders' });
    }
    res.json(results);
  });
};

// CREATE a new reminder for a specific user
export const createReminder = (req, res) => {
  const { title, startTime, endTime } = req.body;
  const { id: userId } = req.user; // Extract userId from req.user

  db.query(
    'INSERT INTO reminders (title, startTime, endTime, user_id) VALUES (?, ?, ?, ?)',
    [title, startTime, endTime, userId],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error creating reminder' });
      }
      res.status(201).json({ id: result.insertId, title, startTime, endTime, userId });
    }
  );
};

// UPDATE a reminder by ID for a specific user
export const updateReminder = (req, res) => {
  const { id } = req.params;
  const { title, startTime, endTime } = req.body;
  const { id: userId } = req.user;

  db.query(
    'UPDATE reminders SET title = ?, startTime = ?, endTime = ? WHERE id = ? AND user_id = ?',
    [title, startTime, endTime, id, userId],
    (err, result) => { 
      if (err) {
        return res.status(500).json({ error: 'Error updating reminder' });
      }
      res.status(200).json({ id, title, startTime, endTime });
    }
  );
};

// DELETE a reminder by ID for a specific user
export const deleteReminder = (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  db.query('DELETE FROM reminders WHERE id = ? AND user_id = ?', [id, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error deleting reminder' });
    }
    res.status(200).json({ message: 'Reminder deleted successfully' });
  });
};
