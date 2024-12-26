//backend/controllers/Feedbackcontrollers.js

import { db } from '../db.js';

/**
 * Handle feedback submission.
 */
export const submitFeedback = async (req, res) => {
    console.log('API HIT: /feedback'); // Log when API is hit
    console.log('Request Body:', req.body); // Log the request body

    const { user_id, plan_id, rating, feedback, recommend_status } = req.body;

    if (!user_id || !plan_id || !rating) {
        console.error('Validation error: Missing required fields.');
        return res.status(400).json({ error: 'User ID, Plan ID, and Rating are required.' });
    }

    try {
        const query = `
            INSERT INTO feedback (user_id, plan_id, rating, feedback, recommend_status) 
            VALUES (?, ?, ?, ?, ?)
        `;
        console.log('Executing Query:', query); // Log the query
        const [result] = await db.query(query, [user_id, plan_id, rating, feedback, recommend_status]);
        console.log('Query Result:', result); // Log query result

        return res.status(201).json({
            message: 'Feedback submitted successfully.',
            feedbackId: result.insertId,
        });
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
};
