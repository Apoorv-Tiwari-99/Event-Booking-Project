// config/database.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

// CORRECTED CONFIG - Only valid MySQL2 options:
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'demo_pass',
  database: process.env.DB_NAME || 'event_booking',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
};

const pool = mysql.createPool(dbConfig);

// Function to create demo admin account
const createDemoAdmin = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Check if demo admin already exists
    const [adminUsers] = await connection.execute(
      'SELECT * FROM users WHERE email = ?', 
      ['admin1@example.com']
    );
    
    if (adminUsers.length === 0) {
      console.log('Creating demo admin account...');
      const hashedPassword = await bcrypt.hash('admin1', 10);
      
      await connection.execute(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Demo Admin', 'admin1@example.com', hashedPassword, 'admin']
      );
      console.log('✅ Demo admin created: admin1@example.com / admin1');
    } else {
      console.log('Demo admin account already exists');
    }
    
    connection.release();
  } catch (error) {
    console.error('Error creating demo admin:', error);
  }
};

// Function to create demo user account
const createDemoUser = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Check if demo user already exists
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE email = ?', 
      ['user1@example.com']
    );
    
    if (users.length === 0) {
      console.log('Creating demo user account...');
      const hashedPassword = await bcrypt.hash('user1', 10);
      
      await connection.execute(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Demo User', 'user1@example.com', hashedPassword, 'user']
      );
      console.log('✅ Demo user created: user1@example.com / user1');
    } else {
      console.log('Demo user account already exists');
    }
    
    connection.release();
  } catch (error) {
    console.error('Error creating demo user:', error);
  }
};

// Test connection and create demo accounts
pool.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully');
    connection.release();
    
    // Create demo accounts after successful connection
    createDemoAdmin();
    createDemoUser();
  })
  .catch(error => {
    console.error('❌ Database connection failed:', error.message);
    console.log('Please check:');
    console.log('1. Is MySQL running?');
    console.log('2. Are the credentials in .env file correct?');
    console.log('3. Does the database exist?');
  });

export default pool;