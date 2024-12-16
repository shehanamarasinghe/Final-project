import express from 'express';
import { addMember, loginUser, getQrCode, getUsers, updateUser, deleteUser } from '../controllers/usercontroller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateUserUpdate } from '../middleware/validation.js';

const router = express.Router();

router.post('/add', addMember);
router.post('/get', loginUser);
router.get('/qr-code', authMiddleware, getQrCode);
router.get('/getuser', getUsers);
router.put('/update/:userid', validateUserUpdate, updateUser);
router.delete('/delete/:userid', deleteUser);

export default router;
