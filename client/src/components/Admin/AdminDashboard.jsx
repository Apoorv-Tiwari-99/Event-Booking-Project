// src/components/Admin/AdminDashboard.js
import React from 'react';
import { motion } from 'framer-motion';
import { 
  CalendarIcon, 
  SparklesIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';
import EventManagement from './EventManagement';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AdminDashboard = () => {
  const { user, logout } = useAuth(); // Get user and logout from auth context
  const navigate = useNavigate(); // Initialize navigate

  // Add handleLogout function
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/'); // Redirect to home page after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50"
    >
      {/* Enhanced Header with parallax effect */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-xl"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                <SparklesIcon className="h-8 w-8 text-yellow-300" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Event <span className="text-yellow-300">Admin</span> Dashboard
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Manage all your events in one place
            </p>
          </motion.div>
        </div>

        {/* Add user info and logout button */}
        <div className="absolute top-4 right-4 z-30">
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="text-sm text-blue-100 bg-blue-800 bg-opacity-50 px-3 py-1 rounded-full">
                  Admin: {user.name}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg text-white text-sm transition-colors"
                  title="Logout"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  <span>Logout</span>
                </motion.button>
              </>
            )}
          </div>
        </div>
        
        {/* Curved bottom edge */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none" 
            className="w-full h-16 text-gray-50 fill-current"
          >
            <path d="M0,0V6c0,21.6,291,111.46,741,110.26,445.39,3.6,459-88.3,459-110.26V0Z" />
          </svg>
        </div>
      </motion.header>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-10 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
        >
          <EventManagement />
        </motion.div>
      </div>
      
      {/* Add custom animation styles */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </motion.div>
  );
};

export default AdminDashboard;