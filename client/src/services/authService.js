import axiosInstance from '../utils/axiosInstance';

export const authService = {
  // Register user
  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  // Login user
login: async (credentials) => {
  try {
    // Only send email and password to backend
    const { email, password } = credentials;
    const response = await axiosInstance.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
},

  // Get user profile
  getProfile: async () => {
    try {
      const response = await axiosInstance.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch profile' };
    }
  },

  // Logout (client-side only)
  logout : async () => {
    try {
      // Call the logout API endpoint
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
      // Even if the API call fails, we still want to clear local storage
    } finally {
      // Clear local storage regardless of API success/failure
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  // Get stored user data
  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Store auth data
  storeAuthData: (token, user) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
  }
};