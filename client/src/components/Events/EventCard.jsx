// src/components/Events/EventCard.js
import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPinIcon, 
  CalendarIcon, 
  TicketIcon, 
  CurrencyDollarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const EventCard = ({ event, index }) => {
  const availableSeats = event.truly_available !== undefined ? event.truly_available : event.available_seats;
  const seatPercentage = (availableSeats / event.total_seats) * 100;
  
  const getSeatStatusColor = () => {
    if (seatPercentage > 50) return 'bg-green-500';
    if (seatPercentage > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const { date: formattedDate, time: formattedTime } = formatDate(event.date);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group"
    >
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.05 }}
          className="w-full h-full object-cover"
          src={event.image_url || '/placeholder-event.jpg'}
          alt={event.title}
        />
        {/* Date Badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-center shadow-md">
          <div className="text-sm font-bold text-gray-900">{formattedDate.split(' ')[1]}</div>
          <div className="text-xs text-gray-600">{formattedDate.split(' ')[0]}</div>
        </div>
        
        {/* Seat Availability Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-md">
          <span className={`inline-block w-2 h-2 rounded-full mr-1 ${getSeatStatusColor()}`}></span>
          <span className="text-sm font-medium text-gray-900">
            {availableSeats} seats left
          </span>
        </div>
      </div>

      {/* Event Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {event.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
        
        {/* Event Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{formattedDate} • {formattedTime}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-500">
              <TicketIcon className="h-4 w-4 mr-2" />
              <span>{availableSeats} of {event.total_seats} available</span>
            </div>
            
            <div className="flex items-center text-lg font-bold text-blue-600">
              <CurrencyDollarIcon className="h-5 w-5 mr-1" />
              <span>{event.price}</span>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${seatPercentage}%` }}
              transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
              className={`h-2 rounded-full ${getSeatStatusColor()}`}
            />
          </div>
        </div>
        
        {/* View Details Button */}
        <Link to={`/events/${event.id}`}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl flex items-center justify-center space-x-2 group-hover:shadow-lg transition-all"
          >
            <span>View Details</span>
            <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
};

export default EventCard;