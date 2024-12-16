import { db } from "../db.js";
import Stripe from "stripe";

const stripeInstance = new Stripe('sk_test_51QU8QmKtCgAvcByOanxtQDGV4VY7miBconIETH3sucDlWFzmxLQHQWUxyLGuZmeZW5BRnGFpqMO8Lm7z7UEwj5B600ENL1SNIi');

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency, name, email, address, city, state, zip } = req.body;
    const userId = req.user.id;
    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: amount * 100,
      currency,
      payment_method_types: ["card"],
    });
    const sql = `
      INSERT INTO payments (user_id, name, email, address, city, state, zip, amount, currency, payment_intent_id, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [userId, name, email, address, city, state, zip, amount, currency, paymentIntent.id, "Pending"], (err) => {
      if (err) {
        return res.status(500).json({ success: false, error: "Database error." });
      }
      res.status(200).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentIntentId, status } = req.body;
    const sql = "UPDATE payments SET status = ? WHERE payment_intent_id = ?";
    db.query(sql, [status, paymentIntentId], (err) => {
      if (err) {
        return res.status(500).json({ success: false, error: "Database error." });
      }
      res.status(200).json({ success: true });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const sql = "SELECT * FROM payments WHERE user_id = ? ORDER BY id DESC";
    db.query(sql, [userId], (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, error: "Database error." });
      }
      res.status(200).json({ success: true, transactions: results });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getPayments = async (req, res) => {
  try {
    const [payments] = await db.query(`
      SELECT p.id, p.name, p.email, p.status 
      FROM payments p 
      JOIN login u ON p.user_id = u.userid
    `);
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving payments data" });
  }
};

export const getFinancialMetrics = async (req, res) => {
  try {
    const [grossRevenue] = await db.query("SELECT SUM(amount) AS grossRevenue FROM payments WHERE status = 'completed'");
    const [netRevenue] = await db.query("SELECT SUM(amount) AS netRevenue FROM payments WHERE status = 'completed'");
    const [refunds] = await db.query("SELECT SUM(amount) AS refunds FROM payments WHERE status = 'refunded'");
    const previousMonthGrowth = 8.5;
    res.json({
      grossRevenue: grossRevenue[0]?.grossRevenue || 0,
      netRevenue: netRevenue[0]?.netRevenue || 0,
      refunds: refunds[0]?.refunds || 0,
      previousMonthGrowth,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving financial metrics" });
  }
};

export const getMembershipMetrics = async (req, res) => {
  try {
    const [newMembers] = await db.query(`
      SELECT COUNT(*) AS newMembers FROM login 
      WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 MONTH)
    `);
    const [totalMembers] = await db.query("SELECT COUNT(*) AS totalMembers FROM login");
    const [retentionRate] = await db.query(`
      SELECT (COUNT(*) / (SELECT COUNT(*) FROM login)) * 100 AS retentionRate FROM login WHERE active = 1
    `);
    const growthRate = 7.2;
    res.json({
      newMembers: newMembers[0]?.newMembers || 0,
      retentionRate: retentionRate[0]?.retentionRate || 0,
      totalMembers: totalMembers[0]?.totalMembers || 0,
      growthRate,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving membership metrics" });
  }
};
