// controllers/authController.js
import jwt from 'jsonwebtoken';
import { findUserByEmail, comparePassword, createUser, findUserById } from '../models/userModel.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/jwt.js';

// controllers/authController.js - register function
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body; // Add role here

    console.log("Req body in register ",req.body);
    
    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create user with the provided role
    const userId = await createUser(name, email, password, role); // Pass role here
    
    // Generate JWT token with the actual role
    const token = jwt.sign(
      { id: userId, email, role: role }, // Use the actual role
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: userId, name, email, role: role } // Return the actual role
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body; // Only email and password here
     console.log("email is",email);
    // Find user
    const user = await findUserByEmail(email);
    if (!user) {
      console.log("Reaching login api here ",user);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    
    // Check password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      console.log("Wrong pass");
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role }, // Use user.role from database
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    console.log("End of login api");
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role // This should be 'admin' for admin user
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// controllers/authController.js
// Add this function to your authController.js
export const logout = async (req, res) => {
  try {
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};