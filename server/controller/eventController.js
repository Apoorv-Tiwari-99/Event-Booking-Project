// controllers/eventController.js
import {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    getEventsByAdminId,
    updateAvailableSeats
  } from '../models/eventModel.js';
  import { getLockedSeats } from '../models/seatModel.js';
  import { emitSeatUpdate } from '../utils/socket.js';
  
  // controllers/eventController.js - Update createNewEvent function
export const createNewEvent = async (req, res) => {
  try {
    const eventData = req.body;
    const createdBy = req.user.id; // Get the logged-in user ID
    const eventId = await createEvent(eventData, createdBy);
    
    res.status(201).json({
      message: 'Event created successfully',
      eventId
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
  
  // controllers/eventController.js - Add this function
export const getAdminEvents = async (req, res) => {
  try {
    const adminId = req.user.id; // Get the logged-in admin ID
    
    // Get events created by this admin
    const events = await getEventsByAdminId(adminId);
    
    // Add real-time availability information
    const eventsWithAvailability = await Promise.all(
      events.map(async (event) => {
        const lockedSeats = await getLockedSeats(event.id);
        return {
          ...event,
          truly_available: event.available_seats - lockedSeats
        };
      })
    );
    console.log("Reaching getadmin events",eventsWithAvailability);
    res.json(eventsWithAvailability);
  } catch (error) {
    console.error('Get admin events error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

  export const getEvents = async (req, res) => {
    try {
      const filters = {};
      
      if (req.query.location) filters.location = req.query.location;
      if (req.query.date) filters.date = req.query.date;
      if (req.query.search) filters.search = req.query.search;
      
      const events = await getAllEvents(filters);
      
      // Add real-time availability information
      const eventsWithAvailability = await Promise.all(
        events.map(async (event) => {
          const lockedSeats = await getLockedSeats(event.id);
          return {
            ...event,
            truly_available: event.available_seats - lockedSeats
          };
        })
      );
      
      res.json(eventsWithAvailability);
    } catch (error) {
      console.error('Get events error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  export const getEvent = async (req, res) => {
    try {
      const { id } = req.params;
      const event = await getEventById(id);
      
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      // Add real-time availability information
      const lockedSeats = await getLockedSeats(id);
      event.truly_available = event.available_seats - lockedSeats;
      
      res.json(event);
    } catch (error) {
      console.error('Get event error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  export const updateEventById = async (req, res) => {
    try {
      const { id } = req.params;
      const eventData = req.body;
      
      const affectedRows = await updateEvent(id, eventData);
      
      if (affectedRows === 0) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      // Get the updated event
      const updatedEvent = await getEventById(id);
      
      // Add real-time availability information
      const lockedSeats = await getLockedSeats(id);
      updatedEvent.truly_available = updatedEvent.available_seats - lockedSeats;
  
      // Emit socket event for real-time updates
      if (req.io) {
        emitSeatUpdate(req.io, id, {
          available_seats: updatedEvent.available_seats,
          truly_available: updatedEvent.truly_available,
          total_seats: updatedEvent.total_seats
        });
      }
  
      res.json({ message: 'Event updated successfully' });
    } catch (error) {
      console.error('Update event error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  export const deleteEventById = async (req, res) => {
    try {
      const { id } = req.params;
      
      const affectedRows = await deleteEvent(id);
      
      if (affectedRows === 0) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      res.json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error('Delete event error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };