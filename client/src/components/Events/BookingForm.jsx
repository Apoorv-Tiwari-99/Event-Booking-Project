// src/components/Events/BookingForm.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  TicketIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../../contexts/AuthContext';

const BookingForm = ({ event, onBookingSuccess, onCancel, isModal = false }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: '',
    quantity: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const bookingData = {
        event_id: event.id,
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        quantity: parseInt(formData.quantity)
      };

      const response = await axiosInstance.post('/bookings', bookingData);
      onBookingSuccess(response.data);
    } catch (error) {
      console.error('Booking error:', error);
      setError(error.response?.data?.message || 'Failed to book tickets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = formData.quantity * event.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      {isModal && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Book Tickets</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <div className="relative">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
            <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
            <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <div className="relative">
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your phone number"
            />
            <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Tickets</label>
          <div className="relative">
            <select
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {[...Array(Math.min(10, event.available_seats))].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} ticket{i + 1 > 1 ? 's' : ''}
                </option>
              ))}
            </select>
            <TicketIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Price per ticket:</span>
            <span className="font-semibold">${event.price}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Quantity:</span>
            <span className="font-semibold">{formData.quantity}</span>
          </div>
          <div className="flex justify-between items-center border-t border-blue-100 pt-2">
            <span className="text-gray-800 font-medium">Total Amount:</span>
            <span className="text-lg font-bold text-blue-600">${totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex space-x-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Confirm Booking'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default BookingForm;