import express from 'express';

import { sendThankYouEmail } from '../controllers/emailController.js';

const router = express.Router();

router.post('/thank-you', sendThankYouEmail);

export default router;