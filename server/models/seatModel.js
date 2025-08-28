// models/seatModel.js
import pool from '../config/database.js';

export const lockSeats = async (event_id, user_id, quantity, lockDuration = 5) => {
  // Clear expired locks first
  await clearExpiredLocks();
  
  const lockedUntil = new Date(Date.now() + lockDuration * 60 * 1000); // 5 minutes by default
  
  const [result] = await pool.execute(
    'INSERT INTO locked_seats (event_id, user_id, quantity, locked_until) VALUES (?, ?, ?, ?)',
    [event_id, user_id, quantity, lockedUntil]
  );
  
  return result.insertId;
};

export const getLockedSeats = async (event_id) => {
  await clearExpiredLocks();
  
  const [rows] = await pool.execute(
    'SELECT SUM(quantity) as total_locked FROM locked_seats WHERE event_id = ?',
    [event_id]
  );
  
  return rows[0].total_locked || 0;
};

export const clearExpiredLocks = async () => {
  await pool.execute(
    'DELETE FROM locked_seats WHERE locked_until < NOW()'
  );
};

export const releaseSeats = async (event_id, user_id) => {
  const [result] = await pool.execute(
    'DELETE FROM locked_seats WHERE event_id = ? AND user_id = ?',
    [event_id, user_id]
  );
  
  return result.affectedRows;
};

export const extendSeatLock = async (lock_id, additionalMinutes = 5) => {
  const newLockTime = new Date(Date.now() + additionalMinutes * 60 * 1000);
  
  const [result] = await pool.execute(
    'UPDATE locked_seats SET locked_until = ? WHERE id = ?',
    [newLockTime, lock_id]
  );
  
  return result.affectedRows;
};