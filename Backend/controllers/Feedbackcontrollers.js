import { db } from '../db.js';


export const submitFeedback = async (req, res) => {
    const user_id = req.user?.id || req.user?.user_id;
    const { plan_id, rating, feedback, recommend_status } = req.body;

    if (!user_id) {
        return res.status(401).send('User not properly authenticated');
    }

    if (!plan_id || !rating) {
        return res.status(400).send('Plan ID and Rating are required.');
    }

    try {
        const recommendStatusValue = recommend_status === undefined ? 0 : recommend_status;

        const query = `
            INSERT INTO feedback (user_id, plan_id, rating, feedback, recommend_status,created_at
            ) 
            VALUES (?, ?, ?, ?, ?, NOW())
        `;
        
        await db.query(query, [user_id, plan_id, rating, feedback || '', recommendStatusValue]);
        res.status(201).send('Feedback submitted successfully');
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Internal server error');
    }
};

export const getPlanReviews = (req, res) => {
  const planId = req.params.planId;

  const query = `
    SELECT 
      f.id AS feedback_id, 
      f.rating, 
      f.feedback, 
      f.recommend_status, 
      l.Firstname, 
      l.Lastname
    FROM feedback f
    JOIN login l ON f.user_id = l.userid
    WHERE f.plan_id = ?`;

  db.query(query, [planId], (error, results) => {
    if (error) {
      console.error("Error fetching reviews:", error);
      return res.status(500).json({ message: "Internal server error." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No reviews found for this plan." });
    }

    res.status(200).json(results);
  });
};

export const getPlanRatings = (req, res) => {
    const query = `
      SELECT 
        plan_id,
        ROUND(AVG(rating), 1) AS average_rating,
        COUNT(*) AS rating_count
      FROM feedback
      GROUP BY plan_id
    `;
  
    db.query(query, (error, results) => {
      if (error) {
        console.error("Error fetching plan ratings:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
  
      if (results && results.length > 0) {
        res.status(200).json(results); // Return the rows directly
      } else {
        res.status(200).json([]); // Return an empty array if no results are found
      }
    });
  };
  