import { db } from '../db.js';

// Get the live attendance count (for the current day)
 export const getLiveAttendanceCount = async (req, res) => {
  try {
    const [result] = await db.query('SELECT COUNT(*) AS count FROM attendance WHERE DATE(entry_time) = CURDATE()');
    res.json({ count: result.count });
  } catch (error) {
    console.error('Error fetching live attendance count:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get the total count of registered members
export const getRegisteredMembersCount = async (req, res) => {
    try {
      const [result] = await db.query('SELECT COUNT(*) AS count FROM members');
      res.json({ count: result.count });
    } catch (error) {
      console.error('Error fetching registered members count:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  