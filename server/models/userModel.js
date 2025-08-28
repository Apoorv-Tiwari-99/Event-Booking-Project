// models/userModel.js
import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

export const createUser = async (name, email, password, role = 'user') => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, hashedPassword, role]
  );
  return result.insertId;
};

export const findUserByEmail = async (email) => {
  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows[0];
};

export const findUserById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0];
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};