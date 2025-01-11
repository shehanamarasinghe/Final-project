import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Make sure environment variables are loaded
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Add a verification step
transporter.verify(function (error, success) {
  if (error) {
    console.log("Error with email configuration:", error);
  } else {
    console.log("Email server is ready to take our messages");
  }
});

const sendThankYouEmail = async (req, res) => {
  const { memberEmail, slipId, memberName } = req.body;

  try {
    console.log('Attempting to send email with credentials:', {
      user: process.env.EMAIL_USER,
      // Don't log the actual password
      hasPassword: !!process.env.EMAIL_PASSWORD
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: memberEmail,
      subject: 'Thank You for Your Payment',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Thank You for Your Payment</h2>
          <p>Dear ${memberName},</p>
          <p>We are writing to confirm that your payment slip (#${slipId}) has been approved.</p>
          <p>Thank you for being a valued member of our gym. We appreciate your continued trust in us.</p>
          <p>If you have any questions or concerns, please don't hesitate to contact us.</p>
          <br>
          <p>Best regards,</p>
          <p>Your Gym Team</p>
        </div>
      `
    });

    res.json({ success: true, message: 'Thank you email sent successfully' });
  } catch (error) {
    console.error('Error sending thank you email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send thank you email',
      error: error.message 
    });
  }
};

export { sendThankYouEmail };