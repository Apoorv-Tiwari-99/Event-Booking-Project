// src/components/Admin/EventManagement.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  XMarkIcon,
  ArrowPathIcon,
  MapPinIcon,
  TicketIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import EventForm from './EventForm';
import DeleteConfirmationModal from './DeleteConfirmationModel'; // Import the new modal
import axiosInstance from '../../utils/axiosInstance';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    eventId: null,
    eventTitle: ''
  });

  useEffect(() => {
    fetchAdminEvents();
  }, []);

  const fetchAdminEvents = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axiosInstance.get('/events/admin/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching admin events:', error);
      
      if (error.response) {
        setError(error.response.data.message || `Server error: ${error.response.status}`);
      } else if (error.request) {
        setError('Network error. Please check if the server is running.');
      } else {
        setError(error.message || 'Failed to load events');
      }
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (eventId, eventTitle) => {
    setDeleteModal({
      isOpen: true,
      eventId,
      eventTitle
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      eventId: null,
      eventTitle: ''
    });
  };

  const handleDeleteEvent = async () => {
    try {
      await axiosInstance.delete(`/events/${deleteModal.eventId}`);
      setEvents(events.filter(event => event.id !== deleteModal.eventId));
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting event:', error);
      
      if (error.response) {
        alert(error.response.data.message || 'Failed to delete event');
      } else {
        alert('Failed to delete event');
      }
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-b-2 border-blue-500"
        />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-red-50 border border-red-200 rounded-xl p-6 m-6"
      >
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <XMarkIcon className="h-8 w-8 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-red-800 font-medium">Error loading events</h3>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        </div>
        <button
          onClick={fetchAdminEvents}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
        >
          <ArrowPathIcon className="h-5 w-5 mr-2" />
          Try Again
        </button>
      </motion.div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-gray-900"
        >
          Event Management
        </motion.h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-3 rounded-xl flex items-center space-x-2 shadow-lg hover:shadow-xl transition-shadow"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Event</span>
        </motion.button>
      </div>

      {/* Empty State */}
      {events.length === 0 && !loading && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-10 text-center mb-8"
        >
          <CalendarIcon className="h-16 w-16 text-blue-400 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-blue-800 mb-2">No events yet</h3>
          <p className="text-blue-600 mb-6 max-w-md mx-auto">Get started by creating your first event to showcase to your audience</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            Create Your First Event
          </motion.button>
        </motion.div>
      )}

      {/* Events List (only show if there are events) */}
      {events.length > 0 && (
        <>
          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 relative"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search events by title or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </motion.div>

          {/* Events Grid */}
          {filteredEvents.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  {/* Event Image */}
                  <div className="relative h-48 overflow-hidden">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      className="w-full h-full object-cover"
                      src={event.image_url || '/placeholder-event.jpg'}
                      alt={event.title}
                    />
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setEditingEvent(event);
                          setShowForm(true);
                        }}
                        className="bg-white p-2 rounded-full shadow-md hover:bg-blue-50"
                      >
                        <PencilIcon className="h-5 w-5 text-blue-600" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openDeleteModal(event.id, event.title)}
                        className="bg-white p-2 rounded-full shadow-md hover:bg-red-50"
                      >
                        <TrashIcon className="h-5 w-5 text-red-600" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{event.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                    
                    {/* Event Details */}
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <TicketIcon className="h-4 w-4 mr-2" />
                          <span>
                            {event.truly_available !== undefined ? event.truly_available : event.available_seats} / {event.total_seats}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm font-medium text-blue-600">
                          <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                          <span>${event.price}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Bar for Seats */}
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(event.truly_available !== undefined ? event.truly_available : event.available_seats) / event.total_seats * 100}%` }}
                          transition={{ duration: 1 }}
                          className="h-2 rounded-full bg-blue-500"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {Math.round((event.truly_available !== undefined ? event.truly_available : event.available_seats) / event.total_seats * 100)}% seats available
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white rounded-2xl shadow-inner"
            >
              <p className="text-gray-500">No events found matching "{searchTerm}"</p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear search
              </button>
            </motion.div>
          )}
        </>
      )}

      {/* Event Form Modal */}
      {showForm && (
        <EventForm
          event={editingEvent}
          onClose={() => {
            setShowForm(false);
            setEditingEvent(null);
            fetchAdminEvents();
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteEvent}
        eventTitle={deleteModal.eventTitle}
      />
    </div>
  );
};

export default EventManagement;