import { db } from '../db.js';

export const getMemberNotifications = (req, res) => {
    const userId = req.user.id; // Assumes middleware provides authenticated user's ID
  
    const query = `
      SELECT id, request_message, status, created_at
      FROM meal_plan_requests
      WHERE userid = ?
      ORDER BY created_at DESC;
    `;
  
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error' });
      }
  
      res.status(200).json(results);
    });
  };