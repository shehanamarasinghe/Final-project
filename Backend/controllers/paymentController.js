// paymentController.js
import { db } from '../db.js';
import { upload } from '../uploadConfig.js';

export const submitPayment = (req, res) => {
  // The upload middleware handles the file
  upload.single('paymentSlip')(req, res, async (err) => {
    if (err) {
      console.error('File upload error:', err);
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      const userid = req.user.id; // Get from your auth middleware
      const amount = req.body.amount;
      const slipUrl = req.file.path;

      // First insert the payment record
      const insertPaymentQuery = `
        INSERT INTO payment (userid, amount, payment_date, status, slip_url)
        VALUES (?, ?, NOW(), 'pending', ?)
      `;

      db.query(insertPaymentQuery, [userid, amount, slipUrl], (err, paymentResult) => {
        if (err) {
          console.error('Payment insert error:', err);
          return res.status(500).json({ error: 'Failed to save payment record' });
        }

        // Then update the subscription status
        const updateSubscriptionQuery = `
          UPDATE subscriptions
          SET status = 'pending_verification'
          WHERE userid = ?
        `;

        db.query(updateSubscriptionQuery, [userid], (updateErr) => {
          if (updateErr) {
            console.error('Subscription update error:', updateErr);
            return res.status(500).json({ error: 'Failed to update subscription status' });
          }

          res.status(200).json({
            message: 'Payment submitted successfully',
            paymentId: paymentResult.insertId,
            slipUrl: slipUrl
          });
        });
      });

    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
};

export const getSubscription = (req, res) => {
  const userid = req.user.id; // Get from your auth middleware
  const query = `
    SELECT 
      s.plan,
      s.amount,
      s.status,
      s.next_payment_date,
      s.start_date,
      DATEDIFF(s.next_payment_date, CURRENT_DATE()) as remaining_days,
      DATEDIFF(s.next_payment_date, s.start_date) as total_days,
      l.Firstname,
      l.Lastname,
      l.Email
    FROM subscriptions s
    JOIN login l ON l.userid = s.userid
    WHERE s.userid = ?
  `;

  db.query(query, [userid], (err, data) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch subscription data' });
    }
    
    if (!data.length) {
      return res.status(404).json({ error: 'No subscription found' });
    }

    const subscription = {
      plan: data[0].plan,
      amount: data[0].amount,
      status: data[0].status,
      nextPayment: data[0].next_payment_date,
      remainingDays: data[0].remaining_days,
      totalDays: data[0].total_days,
      userInfo: {
        firstName: data[0].Firstname,
        lastName: data[0].Lastname,
        email: data[0].Email
      }
    };

    res.status(200).json(subscription);
  });
};

export const getPaymentHistory = (req, res) => {
  const userid = req.user.id; // Get from your auth middleware
  const query = `
    SELECT 
      p.id,
      p.amount,
      p.payment_date,
      p.status,
      p.slip_url,
      l.Firstname,
      l.Lastname,
      l.Email
    FROM payment p
    JOIN login l ON l.userid = p.userid
    WHERE p.userid = ?
    ORDER BY p.payment_date DESC
  `;

  db.query(query, [userid], (err, data) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch payment history' });
    }
    res.status(200).json(data);
  });
};