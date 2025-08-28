// routes/auth.js
import express from 'express';
import { register, login, getProfile, logout } from '../controller/authController.js'; // Add logout import
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);
router.post('/logout', authenticateToken, logout); // Add logout route

export default router;