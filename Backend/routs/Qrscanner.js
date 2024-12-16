import express from 'express';
import { storeData } from '../controllers/Qrcode.js';

const router = express.Router();

router.post('/store-data', storeData);

export default router;
