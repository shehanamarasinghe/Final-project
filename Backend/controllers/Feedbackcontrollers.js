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
            INSERT INTO feedback (user_id, plan_id, rating, feedback, recommend_status) 
            VALUES (?, ?, ?, ?, ?)
        `;
        
        await db.query(query, [user_id, plan_id, rating, feedback || '', recommendStatusValue]);
        res.status(201).send('Feedback submitted successfully');
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Internal server error');
    }
};