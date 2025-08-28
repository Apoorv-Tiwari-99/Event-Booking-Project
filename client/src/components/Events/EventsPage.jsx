// src/components/Events/EventsPage.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon,
  SparklesIcon,
  ArrowRightOnRectangleIcon,
  WifiIcon,
  SignalSlashIcon
} from '@heroicons/react/24/outline';
import axiosInstance from '../../utils/axiosInstance';
import EventCard from './EventCard';
import EventFilters from './EventFilters';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../contexts/SocketContext';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    date: '',
    minPrice: '',
    maxPrice: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    // When events are loaded, initially show all events
    if (events.length > 0) {
      filterEvents();
    }
  }, [events, searchTerm, filters]);

  // Setup socket listeners for real-time updates
  useEffect(() => {
    if (!socket) return;

    const handleSeatUpdate = (data) => {
      console.log('🔔 Seat update received:', data);
    
      setEvents(prevEvents => {
        let found = false;
    
        const updated = prevEvents.map(event => {
          if (String(event.id) === String(data.eventId)) {
            found = true;
            console.log("✅ Updating event:", event.id, "with new seats:", data);
            return { 
              ...event, 
              available_seats: data.available_seats,
              truly_available: data.truly_available,
              total_seats: data.total_seats
            };
          }
          return event;
        });
    
        if (!found) {
          console.warn("⚠️ No matching event found for eventId:", data.eventId);
        }
    
        return updated;
      });
    };
    
    


     console.log("Events are :",events)
    // Join all event rooms for real-time updates
    events.forEach(event => {
      socket.emit('join-event', event.id);
    });

    // Listen for seat updates
    socket.on('seat-update', handleSeatUpdate);

    // Cleanup on unmount
    return () => {
      socket.off('seat-update', handleSeatUpdate);
      
      // Leave all event rooms
      events.forEach(event => {
        socket.emit('leave-event', event.id);
      });
    };
  }, [socket, events]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axiosInstance.get('/events');
      setEvents(response.data);
      setFilteredEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let result = [...events];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply location filter
    if (filters.location) {
      result = result.filter(event =>
        event.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Apply date filter
    if (filters.date) {
      const filterDate = new Date(filters.date);
      result = result.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === filterDate.toDateString();
      });
    }

    // Apply price filters
    if (filters.minPrice) {
      result = result.filter(event => event.price >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      result = result.filter(event => event.price <= parseFloat(filters.maxPrice));
    }

    setFilteredEvents(result);
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      date: '',
      minPrice: '',
      maxPrice: ''
    });
    setSearchTerm('');
    setFilteredEvents(events);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-16 w-16 border-b-2 border-blue-500"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchEvents}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Enhanced Header */}
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
              Discover Amazing <span className="text-yellow-300">Events</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Find and book tickets for the best events happening around you
            </p>
          </motion.div>
        </div>

        {/* Add user info and logout button */}
        <div className="absolute top-4 right-4 z-30">
          <div className="flex items-center space-x-4">
            {/* Connection Status Indicator */}
            <div className="flex items-center space-x-1 bg-black/20 px-2 py-1 rounded-full">
              {isConnected ? (
                <>
                  <WifiIcon className="h-4 w-4 text-green-400" />
                  <span className="text-xs text-green-200">Live</span>
                </>
              ) : (
                <>
                  < SignalSlashIcon className="h-4 w-4 text-red-400" />
                  <span className="text-xs text-red-200">Offline</span>
                </>
              )}
            </div>

            {user && (
              <>
                <span className="text-sm text-blue-100 bg-blue-800 bg-opacity-50 px-3 py-1 rounded-full">
                  Welcome, {user.name}
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

      {/* Search and Filters Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-10 relative z-20"
      >
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search events by name, location, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
              />
            </div>

            {/* Filter Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#EFF6FF" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 ${
                showFilters 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
              <span>Filters</span>
              {(searchTerm || Object.values(filters).some(filter => filter !== '')) && (
                <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  !
                </span>
              )}
            </motion.button>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <EventFilters
                filters={filters}
                setFilters={setFilters}
                clearFilters={clearFilters}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600 font-medium">
            Showing <span className="text-blue-600 font-bold">{filteredEvents.length}</span> of{" "}
            <span className="text-gray-800">{events.length}</span> events
          </p>
          {(searchTerm || Object.values(filters).some(filter => filter !== '')) && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              <span>Clear all filters</span>
            </motion.button>
          )}
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-md p-12 text-center border border-gray-100"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or filters to find more events.
            </p>
            <button
              onClick={clearFilters}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </motion.section>
      
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
    </div>
  );
};

export default EventsPage;