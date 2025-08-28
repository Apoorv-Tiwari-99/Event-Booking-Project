// routes/bookings.js
import express from 'express';
import {
  createNewBooking,
  getUserBookings,
  getBooking,
  getAllBookingsAdmin,
  cancelUserBooking
} from '../controller/bookingController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, createNewBooking);
router.get('/', authenticateToken, getUserBookings);
router.get('/:id', authenticateToken, getBooking);
router.get('/admin/all', authenticateToken, requireAdmin, getAllBookingsAdmin);
router.put('/:id/cancel', authenticateToken, cancelUserBooking);

export default router;