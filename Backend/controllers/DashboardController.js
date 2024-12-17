import { db } from '../db.js';

// Get live attendance count
export const getLiveAttendanceCount = (req, res) => {
  const query = "SELECT COUNT(*) AS count FROM attendance WHERE DATE(check_in) = CURDATE()";

  db.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching live attendance count:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results && results.length > 0) {
      const count = results[0].count; // Extract count from the first row
      res.status(200).json({ count });
    } else {
      res.status(200).json({ count: 0 }); // Default count if no rows are returned
    }
  });
};

// Get the total count of registered members
export const getRegisteredMembersCount = (req, res) => {
  const query = "SELECT COUNT(*) AS count FROM login";

  db.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching registered members count:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results && results.length > 0) {
      const count = results[0].count; // Extract count from the first row
      res.status(200).json({ count });
    } else {
      res.status(200).json({ count: 0 }); // Default count if no rows are returned
    }
  });
};
