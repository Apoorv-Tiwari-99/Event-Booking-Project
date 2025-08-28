// controllers/bookingController.js
import {
    createBooking,
    getBookingsByUserId,
    getBookingById,
    getAllBookings,
    cancelBooking
  } from '../models/bookingModel.js';
  import { updateAvailableSeats,getEventById } from '../models/eventModel.js';
  import { lockSeats, releaseSeats,getLockedSeats } from '../models/seatModel.js';
  
  export const createNewBooking = async (req, res) => {
    try {
      const { event_id, quantity, name, email, mobile } = req.body;
      const user_id = req.user.id;
      
      // Calculate total amount
      const event = await getEventById(event_id);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      const total_amount = event.price * quantity;
      
      // Check seat availability
      const lockedSeats = await getLockedSeats(event_id);
      const trulyAvailable = event.available_seats - lockedSeats;
      
      if (trulyAvailable < quantity) {
        return res.status(400).json({ message: 'Not enough seats available' });
      }
      
      // Lock seats temporarily
      const lockId = await lockSeats(event_id, user_id, quantity);
      
      try {
        // Update available seats
        const seatsUpdated = await updateAvailableSeats(event_id, quantity);
        
        if (seatsUpdated === 0) {
          await releaseSeats(event_id, user_id);
          return res.status(400).json({ message: 'Not enough seats available' });
        }
        
        // Create booking
        const bookingData = {
          event_id,
          user_id,
          name,
          email,
          mobile,
          quantity,
          total_amount
        };
        
        const bookingId = await createBooking(bookingData);
        
        // Release the seat lock since booking is confirmed
        await releaseSeats(event_id, user_id);
        
        res.status(201).json({
          message: 'Booking created successfully',
          bookingId,
          total_amount
        });
      } catch (error) {
        // Release the seat lock if anything goes wrong
        await releaseSeats(event_id, user_id);
        throw error;
      }
    } catch (error) {
      console.error('Create booking error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  export const getUserBookings = async (req, res) => {
    try {
      const user_id = req.user.id;
      const bookings = await getBookingsByUserId(user_id);
      res.json(bookings);
    } catch (error) {
      console.error('Get user bookings error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  export const getBooking = async (req, res) => {
    try {
      const { id } = req.params;
      const booking = await getBookingById(id);
      
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      
      // Check if the user owns this booking or is an admin
      if (booking.user_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      res.json(booking);
    } catch (error) {
      console.error('Get booking error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  export const getAllBookingsAdmin = async (req, res) => {
    try {
      const bookings = await getAllBookings();
      res.json(bookings);
    } catch (error) {
      console.error('Get all bookings error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  export const cancelUserBooking = async (req, res) => {
    try {
      const { id } = req.params;
      
      // Check if booking exists and belongs to user
      const booking = await getBookingById(id);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      
      if (booking.user_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      const affectedRows = await cancelBooking(id);
      
      if (affectedRows === 0) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      
      // Return seats to availability
      await updateAvailableSeats(booking.event_id, -booking.quantity);
      
      res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
      console.error('Cancel booking error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };