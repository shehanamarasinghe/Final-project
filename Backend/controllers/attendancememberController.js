// controllers/attendanceController.js
import { db } from '../db.js';

export const getAttendance = (req, res) => {
  const userId = req.user.id;
  const query = `
    SELECT 
      DATE_FORMAT(check_in, '%Y-%m-%d') as date,
      DATE_FORMAT(check_in, '%H:%i:%s') as checkIn,
      DATE_FORMAT(check_out, '%H:%i:%s') as checkOut,
      CASE 
        WHEN check_out IS NOT NULL 
        THEN CONCAT(TIMESTAMPDIFF(MINUTE, check_in, check_out), 'm')
        ELSE '-'
      END as duration
    FROM attendance 
    WHERE user_id = ? 
    ORDER BY check_in DESC
  `;

  db.query(query, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
};

export const checkIn = (req, res) => {
  const userId = req.user.id;
  const query = "INSERT INTO attendance (user_id, check_in) VALUES (?, NOW())";
  
  db.query(query, [userId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ id: result.insertId, message: "Check-in successful" });
  });
};

export const checkOut = (req, res) => {
  const userId = req.user.id;
  const query = `
    UPDATE attendance 
    SET check_out = NOW() 
    WHERE user_id = ? 
    AND check_out IS NULL 
    ORDER BY check_in DESC 
    LIMIT 1
  `;
  
  db.query(query, [userId], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No active check-in found" });
    }
    res.json({ message: "Check-out successful" });
  });
};

export const getStats = (req, res) => {
  const userId = req.user.id;
  const month = req.query.month;
  const year = req.query.year;
  
  const query = `
    SELECT 
      COUNT(DISTINCT DATE(check_in)) as daysAttended,
      AVG(TIMESTAMPDIFF(MINUTE, check_in, check_out)) as avgDuration,
      DATE_FORMAT(check_in, '%H:00') as peakHour,
      COUNT(*) as visits
    FROM attendance 
    WHERE user_id = ? 
    AND MONTH(check_in) = ? 
    AND YEAR(check_in) = ?
    AND check_out IS NOT NULL
    GROUP BY DATE_FORMAT(check_in, '%H:00')
    ORDER BY visits DESC
    LIMIT 1
  `;

  db.query(query, [userId, month, year], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data[0] || { daysAttended: 0, avgDuration: 0, peakHour: null });
  });
};