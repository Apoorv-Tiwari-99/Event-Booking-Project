// models/eventModel.js
import pool from '../config/database.js';
// models/eventModel.js - Add this function
export const getEventsByAdminId = async (adminId) => {
  const [rows] = await pool.execute(
    'SELECT * FROM events WHERE created_by = ? ORDER BY created_at DESC',
    [adminId]
  );
  return rows;
};

export const createEvent = async (eventData, createdBy = null) => {
  const { title, description, location, date, total_seats, price, image_url } = eventData;
  
  // Convert ISO date to MySQL datetime format (YYYY-MM-DD HH:MM:SS)
  const mysqlDate = new Date(date).toISOString().slice(0, 19).replace('T', ' ');
  
  const [result] = await pool.execute(
    'INSERT INTO events (title, description, location, date, total_seats, available_seats, price, image_url, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [title, description, location, mysqlDate, total_seats, total_seats, price, image_url, createdBy]
  );
  return result.insertId;
};

export const getAllEvents = async (filters = {}) => {
  let query = 'SELECT * FROM events WHERE 1=1';
  const params = [];
  
  if (filters.location) {
    query += ' AND location LIKE ?';
    params.push(`%${filters.location}%`);
  }
  
  if (filters.date) {
    query += ' AND DATE(date) = ?';
    params.push(filters.date);
  }
  
  if (filters.search) {
    query += ' AND (title LIKE ? OR description LIKE ?)';
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }
  
  query += ' ORDER BY date ASC';
  
  const [rows] = await pool.execute(query, params);
  return rows;
};

export const getEventById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT * FROM events WHERE id = ?',
    [id]
  );
  return rows[0];
};

// models/eventModel.js - Update the updateEvent function
export const updateEvent = async (id, eventData) => {
  const { title, description, location, date, total_seats, price, image_url } = eventData;
  
  // Convert ISO date to MySQL datetime format
  const mysqlDate = new Date(date).toISOString().slice(0, 19).replace('T', ' ');
  
  // First get the current event to calculate the new available_seats
  const currentEvent = await getEventById(id);
  
  // Calculate the new available_seats based on the difference in total_seats
  const currentTotalSeats = currentEvent.total_seats;
  const currentAvailableSeats = currentEvent.available_seats;
  const newTotalSeats = parseInt(total_seats);
  
  let newAvailableSeats;
  if (newTotalSeats > currentTotalSeats) {
    // If increasing total seats, add the difference to available seats
    const difference = newTotalSeats - currentTotalSeats;
    newAvailableSeats = currentAvailableSeats + difference;
  } else if (newTotalSeats < currentTotalSeats) {
    // If decreasing total seats, subtract the difference from available seats
    // But don't let available seats go below 0
    const difference = currentTotalSeats - newTotalSeats;
    newAvailableSeats = Math.max(0, currentAvailableSeats - difference);
  } else {
    // If total seats unchanged, keep current available seats
    newAvailableSeats = currentAvailableSeats;
  }
  
  const [result] = await pool.execute(
    'UPDATE events SET title = ?, description = ?, location = ?, date = ?, total_seats = ?, available_seats = ?, price = ?, image_url = ? WHERE id = ?',
    [title, description, location, mysqlDate, total_seats, newAvailableSeats, price, image_url, id]
  );
  return result.affectedRows;
};

export const deleteEvent = async (id) => {
  const [result] = await pool.execute(
    'DELETE FROM events WHERE id = ?',
    [id]
  );
  return result.affectedRows;
};

export const updateAvailableSeats = async (id, quantity) => {
  const [result] = await pool.execute(
    'UPDATE events SET available_seats = available_seats - ? WHERE id = ? AND available_seats >= ?',
    [quantity, id, quantity]
  );
  return result.affectedRows;
};