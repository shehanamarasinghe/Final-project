import { db } from '../db.js';

// Get all registered members
export const getMembers = async (req, res) => {
  try {
    const query = 'SELECT userid, Firstname, Lastname FROM login';
    db.query(query, (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      res.status(200).json(result);
    });
  } catch (err) {
    console.error('Error fetching members:', err);
    res.status(500).json({ message: 'Failed to fetch members' });
  }
};
