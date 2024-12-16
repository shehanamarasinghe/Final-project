import { db } from '../db.js';

export const createMealPlanRequest = (req, res) => {
    const userId = req.user?.id; // Retrieved from middleware
    const { requestMessage } = req.body;
  
    if (!userId || !requestMessage) {
      return res.status(400).json({ error: 'User ID and Request Message are required.' });
    }
  
    const query = `
      INSERT INTO meal_plan_requests (userid, request_message)
      VALUES (?, ?)
    `;
  
    db.query(query, [userId, requestMessage], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to create meal plan request.' });
      }
  
      res.status(201).json({ message: 'Request submitted successfully.' });
    });
  };
  
// export const getAllMealPlanRequests = (req, res) => {
//     const query = `
//         SELECT r.id, r.userid, u.Firstname, u.Lastname, r.request_message, r.status, r.created_at 
//         FROM meal_plan_requests r
//         JOIN login u ON r.userid = u.userid
//         WHERE r.status = 'Pending'
//         ORDER BY r.created_at DESC
//     `;
//     db.query(query, (err, results) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.status(200).json(results);
//     });
// };
// New function to update the status of a request
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
export const getMealPlanRequestsByStatus = (req, res) => {
  const { status } = req.query; // Get the status from query params (e.g., Pending, Approved, Rejected)

  // Validate status parameter
  const validStatuses = ['Pending', 'Approved', 'Rejected'];
  if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Use Pending, Approved, or Rejected.' });
  }

  // Base query to fetch meal plan requests
  let query = `
      SELECT r.id, r.userid, u.Firstname, u.Lastname, r.request_message, r.status, r.created_at 
      FROM meal_plan_requests r
      JOIN login u ON r.userid = u.userid
  `;

  // Add condition for filtering by status if provided
  if (status) {
      query += ` WHERE r.status = ?`;
  }

  query += ` ORDER BY r.created_at DESC`;

  db.query(query, status ? [status] : [], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(results);
  });
};
