import { db } from '../db.js';

// Get feedback statistics
export const getFeedbackStats = async (req, res) => {
    try {
        // Get total feedback count
        db.query('SELECT COUNT(*) as total FROM feedback', (error, totalResult) => {
            if (error) {
                console.error('Database error:', error);
                return res.status(500).send('Internal server error');
            }

            // Get average rating
            db.query('SELECT AVG(rating) as average_rating FROM feedback', (error, avgResult) => {
                if (error) {
                    console.error('Database error:', error);
                    return res.status(500).send('Internal server error');
                }

                // Get recommendation rate
                db.query(`
                    SELECT 
                        COUNT(CASE WHEN recommend_status = 1 THEN 1 END) * 100.0 / COUNT(*) as recommendation_rate
                    FROM feedback
                `, (error, recResult) => {
                    if (error) {
                        console.error('Database error:', error);
                        return res.status(500).send('Internal server error');
                    }

                    const stats = {
                        total: totalResult[0].total || 0,
                        averageRating: Number(avgResult[0].average_rating || 0).toFixed(1),
                        recommendationRate: Math.round(recResult[0].recommendation_rate || 0)
                    };

                    res.json(stats);
                });
            });
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Internal server error');
    }
};

// Get recent feedbacks with user and plan details
export const getRecentFeedbacks = async (req, res) => {
    try {
        const query = `
            SELECT 
                f.id,
                f.rating,
                f.feedback,
                f.recommend_status,
                f.created_at,
                CONCAT(u.Firstname, ' ', u.Lastname) as user_name,
                w.name as plan_name
            FROM feedback f
            JOIN login u ON f.user_id = u.userid
            JOIN workout_plans w ON f.plan_id = w.id
            ORDER BY f.created_at DESC
            LIMIT 10
        `;

        db.query(query, (error, results) => {
            if (error) {
                console.error('Database error:', error);
                return res.status(500).send('Internal server error');
            }

            const formattedFeedbacks = results.map(feedback => ({
                id: feedback.id,
                userName: feedback.user_name,
                planName: feedback.plan_name,
                rating: feedback.rating,
                feedback: feedback.feedback,
                recommendStatus: feedback.recommend_status,
                date: new Date(feedback.created_at).toISOString().split('T')[0]
            }));

            res.json(formattedFeedbacks);
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Internal server error');
    }
};

// Get feedback stats by plan
export const getFeedbackStatsByPlan = async (req, res) => {
    try {
        const query = `
            SELECT 
                w.id as plan_id,
                w.name as plan_name,
                COUNT(f.id) as total_feedbacks,
                COALESCE(AVG(f.rating), 0) as average_rating,
                COALESCE(SUM(CASE WHEN f.recommend_status = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 0) as recommendation_rate
            FROM workout_plans w
            LEFT JOIN feedback f ON w.id = f.plan_id
            GROUP BY w.id, w.name
            ORDER BY w.name
        `;

        db.query(query, (error, results) => {
            if (error) {
                console.error('Database error:', error);
                return res.status(500).send('Internal server error');
            }

            const formattedStats = results.map(stat => ({
                planId: stat.plan_id,
                planName: stat.plan_name,
                totalFeedbacks: stat.total_feedbacks,
                averageRating: Number(stat.average_rating).toFixed(1),
                recommendationRate: Math.round(stat.recommendation_rate)
            }));

            res.json(formattedStats);
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Internal server error');
    }
};



// Get feedback by plan ID
export const getFeedbackByPlan = async (req, res) => {
    const { planId } = req.params;
    
    try {
        const query = `
            SELECT 
                f.id,
                f.rating,
                f.feedback,
                f.recommend_status,
                f.created_at,
                CONCAT(u.Firstname, ' ', u.Lastname) as user_name,
                w.name as plan_name
            FROM feedback f
            JOIN login u ON f.user_id = u.userid
            JOIN workout_plans w ON f.plan_id = w.id
            WHERE f.plan_id = ?
            ORDER BY f.created_at DESC
        `;

        db.query(query, [planId], (error, results) => {
            if (error) {
                console.error('Database error:', error);
                return res.status(500).send('Internal server error');
            }

            const formattedFeedbacks = results.map(feedback => ({
                id: feedback.id,
                userName: feedback.user_name,
                planName: feedback.plan_name,
                rating: feedback.rating,
                feedback: feedback.feedback,
                recommendStatus: feedback.recommend_status,
                date: new Date(feedback.created_at).toISOString().split('T')[0]
            }));

            res.json(formattedFeedbacks);
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Internal server error');
    }
};