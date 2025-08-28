// src/components/Admin/EventForm.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon,
  PhotoIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import axiosInstance from '../../utils/axiosInstance';

const EventForm = ({ event, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    total_seats: '',
    price: '',
    image_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (event) {
      const eventDate = new Date(event.date);
      setFormData({
        title: event.title || '',
        description: event.description || '',
        location: event.location || '',
        date: eventDate.toISOString().split('T')[0],
        time: eventDate.toTimeString().substring(0, 5),
        total_seats: event.total_seats || '',
        price: event.price || '',
        image_url: event.image_url || ''
      });
    }
  }, [event]);

 // src/components/Admin/EventForm.js - Update the handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  
  try {
    const submitData = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      date: new Date(`${formData.date}T${formData.time}`).toISOString(),
      total_seats: parseInt(formData.total_seats),
      price: parseFloat(formData.price),
      image_url: formData.image_url || null
    };

    if (event) {
      await axiosInstance.put(`/events/${event.id}`, submitData);
    } else {
      await axiosInstance.post('/events', submitData);
    }

    onClose();
  } catch (error) {
    console.error('Error saving event:', error);
    
    if (error.response) {
      setError(error.response.data.message || 'Failed to save event');
    } else {
      setError('Failed to save event');
    }
  } finally {
    setLoading(false);
  }
};

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white/95 backdrop-blur-xl rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200/50">
            <motion.h3 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              {event ? 'Edit Event' : 'Create New Event'}
            </motion.h3>
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mx-6 mt-4 p-4 bg-red-50/80 border border-red-200 rounded-xl backdrop-blur-sm"
              >
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-6">
            {/* Title & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/80 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
                  placeholder="Enter event title"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <MapPinIcon className="w-4 h-4 text-blue-500 mr-2" />
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/80 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
                  placeholder="Enter location"
                />
              </motion.div>
            </div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all resize-none"
                placeholder="Describe your event..."
              />
            </motion.div>

            {/* Date, Time & Seats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <CalendarDaysIcon className="w-4 h-4 text-green-500 mr-2" />
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/80 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <ClockIcon className="w-4 h-4 text-orange-500 mr-2" />
                  Time *
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/80 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <UserGroupIcon className="w-4 h-4 text-indigo-500 mr-2" />
                  Total Seats *
                </label>
                <input
                  type="number"
                  name="total_seats"
                  value={formData.total_seats}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 bg-white/80 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
                  placeholder="100"
                />
              </motion.div>
            </div>

            {/* Price & Image URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <CurrencyDollarIcon className="w-4 h-4 text-green-600 mr-2" />
                  Price ($) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 bg-white/80 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
                  placeholder="0.00"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <PhotoIcon className="w-4 h-4 text-pink-500 mr-2" />
                  Image URL
                </label>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
                  placeholder="https://example.com/image.jpg"
                />
              </motion.div>
            </div>

            {/* Form Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-end space-x-4 pt-6 border-t border-gray-200/50"
            >
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="px-6 py-3 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50/80 backdrop-blur-sm transition-all disabled:opacity-50"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <div className="flex items-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    {event ? 'Updating...' : 'Creating...'}
                  </div>
                ) : (
                  event ? 'Update Event' : 'Create Event'
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EventForm;