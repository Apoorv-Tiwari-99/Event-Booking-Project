// models/bookingModel.js
import pool from '../config/database.js';

export const createBooking = async (bookingData) => {
  const { event_id, user_id, name, email, mobile, quantity, total_amount } = bookingData;
  const [result] = await pool.execute(
    'INSERT INTO bookings (event_id, user_id, name, email, mobile, quantity, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [event_id, user_id, name, email, mobile, quantity, total_amount]
  );
  return result.insertId;
};

export const getBookingsByUserId = async (user_id) => {
  const [rows] = await pool.execute(
    `SELECT b.*, e.title, e.location, e.date 
     FROM bookings b 
     JOIN events e ON b.event_id = e.id 
     WHERE b.user_id = ? 
     ORDER BY b.booking_date DESC`,
    [user_id]
  );
  return rows;
};

export const getBookingById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT b.*, e.title, e.location, e.date 
     FROM bookings b 
     JOIN events e ON b.event_id = e.id 
     WHERE b.id = ?`,
    [id]
  );
  return rows[0];
};

export const getAllBookings = async () => {
  const [rows] = await pool.execute(
    `SELECT b.*, e.title, u.name as user_name 
     FROM bookings b 
     JOIN events e ON b.event_id = e.id 
     JOIN users u ON b.user_id = u.id 
     ORDER BY b.booking_date DESC`
  );
  return rows;
};

export const cancelBooking = async (id) => {
  const [result] = await pool.execute(
    'UPDATE bookings SET status = "cancelled" WHERE id = ?',
    [id]
  );
  return result.affectedRows;
};