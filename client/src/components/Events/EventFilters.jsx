// src/components/Events/EventFilters.js
import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPinIcon, 
  CalendarIcon, 
  XMarkIcon,
  CurrencyDollarIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

const EventFilters = ({ filters, setFilters, clearFilters }) => {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const hasActiveFilters = Object.values(filters).some(
    filter => filter !== '' && filter !== null && filter !== undefined
  );

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="mt-6 pt-6 border-t border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2 text-blue-600" />
          Filter Events
        </h3>
        {hasActiveFilters && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearFilters}
            className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-3 py-1 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-4 w-4" />
            <span>Clear filters</span>
          </motion.button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Location Filter */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <MapPinIcon className="h-4 w-4 mr-1.5 text-blue-500" />
            Location
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Any location"
              value={filters.location || ''}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
            />
            <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Date Filter */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1.5 text-blue-500" />
            Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={filters.date || ''}
              onChange={(e) => handleFilterChange('date', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
            />
            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Min Price Filter */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <CurrencyDollarIcon className="h-4 w-4 mr-1.5 text-blue-500" />
            Min Price
          </label>
          <div className="relative">
            <input
              type="number"
              placeholder="Min"
              min="0"
              value={filters.minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
          </div>
        </div>

        {/* Max Price Filter */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <CurrencyDollarIcon className="h-4 w-4 mr-1.5 text-blue-500" />
            Max Price
          </label>
          <div className="relative">
            <input
              type="number"
              placeholder="Max"
              min="0"
              value={filters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
          </div>
        </div>
      </div>

      {/* Active Filters Indicator */}
      {hasActiveFilters && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center space-x-2 text-sm text-blue-600"
        >
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span>Filters active - {Object.values(filters).filter(f => f).length} applied</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EventFilters;