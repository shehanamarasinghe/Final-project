// controllers/paymentController.js
import { db } from '../db.js';

// Promisify query to use async/await
const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

export const getAllPayments = async (req, res) => {
  try {
    const slips = await query(`
      SELECT 
  p.id,
  p.amount,
  p.payment_date,
  p.status,
  p.slip_url,
  CONCAT(u.Firstname, ' ', u.Lastname) as memberName,
  u.Email as memberEmail,
  s.plan as planName
FROM payment p
JOIN login u ON p.userid = u.userid
JOIN subscriptions s ON p.userid = s.userid
ORDER BY p.payment_date DESC
    `);

    return res.status(200).json(slips);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    // Get total revenue
    const revenueStats = await query(`
      SELECT 
        SUM(amount) as totalRevenue,
        COUNT(*) as totalPayments
      FROM payment 
      WHERE status = 'approved'
      AND payment_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    `);

    // Get previous month's revenue
    const prevMonthRevenue = await query(`
      SELECT SUM(amount) as prevRevenue
      FROM payment 
      WHERE status = 'approved'
      AND payment_date BETWEEN DATE_SUB(CURDATE(), INTERVAL 60 DAY) 
      AND DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    `);

    // Calculate revenue trend
    const revenueTrend = prevMonthRevenue[0].prevRevenue 
      ? ((revenueStats[0].totalRevenue - prevMonthRevenue[0].prevRevenue) / prevMonthRevenue[0].prevRevenue) * 100 
      : 0;

    // Get active members
    const memberStats = await query(`
      SELECT COUNT(DISTINCT userid) as activeMembers
      FROM subscriptions
      WHERE status = 'active'
    `);

    // Get previous month's members
    const prevMonthMembers = await query(`
      SELECT COUNT(DISTINCT userid) as prevActiveMembers
      FROM subscriptions
      WHERE status = 'active'
      AND start_date <= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    `);

    // Calculate members trend
    const membersTrend = prevMonthMembers[0].prevActiveMembers 
      ? ((memberStats[0].activeMembers - prevMonthMembers[0].prevActiveMembers) / prevMonthMembers[0].prevActiveMembers) * 100 
      : 0;

    // Get pending payments
    const pendingStats = await query(`
      SELECT COUNT(*) as pendingPayments
      FROM payment
      WHERE status = 'pending'
    `);

    // Get approval rate
    const approvalStats = await query(`
      SELECT 
        COUNT(CASE WHEN status = 'approved' THEN 1 END) * 100.0 / COUNT(*) as approvalRate
      FROM payment
      WHERE status != 'pending'
    `);

    return res.status(200).json({
      totalRevenue: revenueStats[0].totalRevenue || 0,
      revenueTrend: parseFloat(revenueTrend.toFixed(1)),
      activeMembers: memberStats[0].activeMembers,
      membersTrend: parseFloat(membersTrend.toFixed(1)),
      pendingPayments: pendingStats[0].pendingPayments,
      approvalRate: parseFloat(approvalStats[0].approvalRate?.toFixed(1) || "0")
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getChartData = async (req, res) => {
  try {
    const chartData = await query(`
      SELECT 
        DATE_FORMAT(payment_date, '%b') as month,
        SUM(amount) as revenue,
        COUNT(*) as payments
      FROM payment
      WHERE payment_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      AND status = 'approved'
      GROUP BY DATE_FORMAT(payment_date, '%Y-%m')
      ORDER BY payment_date ASC
    `);

    return res.status(200).json(chartData);
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const approvePayment = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Start transaction
    await query('START TRANSACTION');

    // Update payment status
    await query('UPDATE payment SET status = ? WHERE id = ?', ['approved', id]);

    // Get payment details
    const payment = await query(
      'SELECT userid, amount FROM payment WHERE id = ?', 
      [id]
    );

    // Update subscription
    await query(`
      UPDATE subscriptions 
      SET 
        status = 'active',
        start_date = CURDATE(),
        next_payment_date = DATE_ADD(CURDATE(), INTERVAL 30 DAY)
      WHERE userid = ?
    `, [payment[0].userid]);

    // Commit transaction
    await query('COMMIT');

    return res.status(200).json({ 
      message: 'Payment approved successfully' 
    });
  } catch (error) {
    await query('ROLLBACK');
    console.error('Error approving payment:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const rejectPayment = async (req, res) => {
  const { id } = req.params;
  
  try {
    await query('UPDATE payment SET status = ? WHERE id = ?', ['rejected', id]);
    return res.status(200).json({ 
      message: 'Payment rejected successfully' 
    });
  } catch (error) {
    console.error('Error rejecting payment:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const generateReport = async (req, res) => {
  try {
    const payments = await query(`
      SELECT 
        p.id,
        CONCAT(u.Firstname, ' ', u.Lastname) as memberName,
        u.Email as memberEmail,
        p.amount,
        p.payment_date,
        p.status,
        s.plan as planName
      FROM payment p
      JOIN login u ON p.userid = u.userid
      JOIN subscriptions s ON p.userid = s.userid
      WHERE p.payment_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      ORDER BY p.payment_date DESC
    `);

    // Convert data to CSV format
    const csvData = payments.map(payment => {
      return `${payment.id},${payment.memberName},${payment.memberEmail},${payment.amount},${payment.payment_date},${payment.status},${payment.planName}`;
    }).join('\n');

    const headers = 'ID,Member Name,Email,Amount,Payment Date,Status,Plan\n';
    const csv = headers + csvData;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=payment-report.csv');
    return res.status(200).send(csv);
  } catch (error) {
    console.error('Error generating report:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};