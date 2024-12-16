import express from 'express';
import { getMembers } from '../controllers/members.js';

const router = express.Router();

// Route to get all members
router.get('/check', getMembers);

export default router;
