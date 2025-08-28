// routes/events.js - Add the new route
import express from 'express';
import {
  createNewEvent,
  getEvents,
  getEvent,
  updateEventById,
  deleteEventById,
  getAdminEvents // Add this import
} from '../controller/eventController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getEvents);
router.get('/admin/events', authenticateToken, requireAdmin, getAdminEvents); // Add this line
router.get('/:id', getEvent);
router.post('/', authenticateToken, requireAdmin, createNewEvent);
router.put('/:id', authenticateToken, requireAdmin, updateEventById);
router.delete('/:id', authenticateToken, requireAdmin, deleteEventById);

export default router;