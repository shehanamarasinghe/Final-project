import { db } from '../db.js';

export const getAllMealPlanRequests = (req, res) => {
    const query = `
        SELECT r.id, r.userid, u.Firstname, u.Lastname, r.request_message, r.status, r.created_at 
        FROM meal_plan_requests r
        JOIN login u ON r.userid = u.userid
        WHERE r.status = 'Pending'
        ORDER BY r.created_at DESC
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
};
export const updateMealPlanRequestStatus = (req, res) => {
    const requestId = req.params.id;
    const { status } = req.body;
  
    // Validate input
    if (!['Approved', 'Rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value. Use "Approved" or "Rejected".' });
    }
  
    const query = `
        UPDATE meal_plan_requests
        SET status = ?
        WHERE id = ?
    `;
  
    db.query(query, [status, requestId], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to update request status.' });
        }
  
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Request not found.' });
        }
  
        res.status(200).json({ message: `Request ${requestId} successfully updated to ${status}.` });
    });
  };
   // File: controllers/Notipending.js
 export const getNotificationCount = (req, res) => {
  const query = "SELECT COUNT(*) AS count FROM meal_plan_requests WHERE status = 'Pending'";

  db.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching notification count:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    //Ensure results are valid
    if (results && results.length > 0) {
      const count = results[0].count; // Extract count from the first row
      res.status(200).json({ count });
    } else {
      res.status(200).json({ count: 0 }); // No pending notifications
    }
  });
};

  
  
  
  
  
  