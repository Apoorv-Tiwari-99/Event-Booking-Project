import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService'; // Import authService directly for testing

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const { login, error: authError, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Login component mounted');
    // Test backend connection on component mount
    testBackendConnection();
    return () => {
      console.log('Login component unmounting');
    };
  }, []);

  const testBackendConnection = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/health`);
      const data = await response.json();
      setDebugInfo(`Backend connection: ${response.status} - ${data.message}`);
      console.log('Backend health check:', data);
    } catch (error) {
      setDebugInfo(`Backend connection failed: ${error.message}`);
      console.error('Backend health check failed:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (localError || authError) {
      setLocalError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submission started with:', formData);
    
    if (!formData.email || !formData.password) {
      setLocalError('Please fill in all fields');
      return;
    }

    try {
      setLocalError('');
      console.log('Attempting login...');
      
      // Direct test without context
      try {
        const testResponse = await authService.login(formData);
        console.log('Direct authService test successful:', testResponse);
      } catch (directError) {
        console.error('Direct authService test failed:', directError);
      }
      
      const user = await login(formData.email, formData.password);
      console.log('Login successful, user:', user);
      
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/events');
      }
    } catch (error) {
      console.error('Login error caught in component:', error);
      setLocalError(error.message || 'Login failed. Please check your credentials.');
    }
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-2xl">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                EventFlow
              </h1>
            </Link>
            <p className="text-gray-300 mt-2">Welcome back! Please sign in to your account.</p>
          </div>

          {/* Debug Info */}
          <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-blue-300 text-sm">Debug: {debugInfo}</p>
          </div>

          {displayError && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-300 text-sm">{displayError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 w-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-12 py-3 w-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  )}
                </button>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <p className="text-sm text-blue-300">
                <strong>Demo Admin:</strong> admin1@example.com / admin1 <br />
                <strong>Demo User:</strong>  user1@example.com / user1
              </p>
            </div>

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;