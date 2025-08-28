import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserIcon,
  TicketIcon,
  ArrowLeftIcon,
  QrCodeIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import axiosInstance from '../../utils/axiosInstance';
import BookingForm from './BookingForm';
import QRCode from 'qrcode';


const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axiosInstance.get(`/events/${id}`);
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event details:', error);
      setError('Failed to load event details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSuccess = (bookingData) => {
    setBookingSuccess(bookingData);
    setShowBookingForm(false);
    // Refresh event data to update available seats
    fetchEventDetails();
  };

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
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
            onClick={() => navigate('/events')}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors mr-4"
          >
            Back to Events
          </button>
          <button
            onClick={fetchEventDetails}
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="text-gray-500 text-6xl mb-4">❓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/events')}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors"
          >
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-12">
      {/* Header with Back Button */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/events')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Events
            </button>
            <div className="flex items-center space-x-4">
              {event.available_seats > 0 ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {event.available_seats} seats available
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  Sold Out
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Event Details */}
          <div className="lg:col-span-2">
            {/* Event Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl overflow-hidden shadow-xl mb-6"
            >
              <img
                src={event.image_url || `https://source.unsplash.com/random/800x400/?${event.title}`}
                alt={event.title}
                className="w-full h-64 md:h-80 object-cover"
              />
            </motion.div>

            {/* Event Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-md p-6 mb-6"
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <CalendarIcon className="h-5 w-5 mr-2 text-blue-500" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPinIcon className="h-5 w-5 mr-2 text-blue-500" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <CurrencyDollarIcon className="h-5 w-5 mr-2 text-blue-500" />
                  <span className="font-semibold text-gray-900">${event.price}</span><span className='ml-2'>per ticket</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <TicketIcon className="h-5 w-5 mr-2 text-blue-500" />
                  <span>{event.available_seats} of {event.total_seats} available</span>
                </div>
              </div>

              <div className="prose max-w-none text-gray-700">
                <h3 className="text-xl font-semibold mb-3">About This Event</h3>
                <p>{event.description}</p>
              </div>
            </motion.div>

            {/* Location Map (Placeholder) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-md p-6"
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <MapPinIcon className="h-5 w-5 mr-2 text-blue-500" />
                Location
              </h3>
              <div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center">
                <p className="text-gray-500">Map would be integrated here</p>
              </div>
            </motion.div>
          </div>

          {/* Booking Panel */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="sticky top-24 bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <TicketIcon className="h-5 w-5 mr-2 text-blue-500" />
                Book Your Tickets
              </h3>

              <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Price per ticket:</span>
                  <span className="font-bold text-blue-600">${event.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Available seats:</span>
                  <span className={`font-bold ${event.available_seats > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {event.available_seats}
                  </span>
                </div>
              </div>

              {bookingSuccess ? (
                <BookingSuccessConfirmation 
                  bookingData={bookingSuccess} 
                  event={event}
                  onNewBooking={() => setBookingSuccess(null)}
                />
              ) : event.available_seats > 0 ? (
                <>
                  {!showBookingForm ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowBookingForm(true)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                      Book Now
                    </motion.button>
                  ) : (
                    <BookingForm
                      event={event}
                      onBookingSuccess={handleBookingSuccess}
                      onCancel={() => setShowBookingForm(false)}
                    />
                  )}
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-red-500 font-medium mb-4">This event is sold out</p>
                  <button
                    onClick={() => navigate('/events')}
                    className="text-blue-500 hover:text-blue-700 font-medium"
                  >
                    Browse other events
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Booking Form Modal for Mobile */}
      <AnimatePresence>
        {showBookingForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 lg:hidden"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
            >
              <BookingForm
                event={event}
                onBookingSuccess={handleBookingSuccess}
                onCancel={() => setShowBookingForm(false)}
                isModal={true}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Booking Success Component
const BookingSuccessConfirmation = ({ bookingData, event, onNewBooking }) => {
    const [showConfetti, setShowConfetti] = useState(true);
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState(null);
    const qrCodeRef = useRef(null);
    
    useEffect(() => {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }, []);
  
    useEffect(() => {
      // Generate QR code when component mounts
      generateQRCode();
    }, []);
  
    const generateQRCode = async () => {
      try {
        // Create QR code content with booking details
        const qrContent = JSON.stringify({
          event: event.title,
          date: event.date,
          location: event.location,
          bookingRef: bookingData.booking_ref,
          quantity: bookingData.quantity,
          totalAmount: bookingData.total_amount
        });
        
        // Generate QR code as data URL
        const url = await QRCode.toDataURL(qrContent, {
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        
        setQrCodeDataUrl(url);
      } catch (err) {
        console.error('Error generating QR code:', err);
      }
    };
  
    const downloadTicket = () => {
      if (!qrCodeDataUrl) return;
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = qrCodeDataUrl;
      link.download = `ticket-${bookingData.booking_ref}.png`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  
    const printTicket = () => {
      if (!qrCodeRef.current) return;
      
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Ticket - ${event.title}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 20px;
              }
              .ticket {
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 20px;
                max-width: 300px;
                margin: 0 auto;
              }
              .event-title {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 10px;
              }
              .booking-ref {
                font-size: 14px;
                margin-bottom: 15px;
                color: #666;
              }
              .qr-code {
                margin: 15px 0;
              }
              .details {
                font-size: 14px;
                margin-bottom: 5px;
              }
            </style>
          </head>
          <body>
            <div class="ticket">
              <div class="event-title">${event.title}</div>
              <div class="booking-ref">Ref: ${bookingData.booking_ref}</div>
              <div class="qr-code">
                <img src="${qrCodeDataUrl}" alt="QR Code" />
              </div>
              <div class="details">Date: ${new Date(event.date).toLocaleDateString()}</div>
              <div class="details">Location: ${event.location}</div>
              <div class="details">Tickets: ${bookingData.quantity}</div>
            </div>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      
      // Wait for image to load before printing
      setTimeout(() => {
        printWindow.print();
        // printWindow.close(); // Uncomment if you want to automatically close after printing
      }, 500);
    };
  
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        {showConfetti && (
          <div className="confetti">
            {[...Array(50)].map((_, i) => (
              <div key={i} className="confetti-piece" style={{
                transform: `rotate(${Math.random() * 360}deg)`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                background: ['#ff577f', '#ff884b', '#ffd384', '#fff9b0', '#c0f6ff', '#a0deff'][i % 6]
              }} />
            ))}
          </div>
        )}
        
        <div className="mb-4 text-green-500">
          <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
        <p className="text-gray-600 mb-4">Your tickets have been reserved successfully.</p>
        
        <div className="bg-gray-50 rounded-xl p-4 mb-4 text-left">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Booking Reference:</span>
            <span className="font-mono font-semibold">{bookingData.booking_ref}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Tickets:</span>
            <span className="font-semibold">{bookingData.quantity}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Total Amount:</span>
            <span className="font-semibold">${bookingData.total_amount}</span>
          </div>
        </div>
        
        {/* QR Code Preview */}
        {qrCodeDataUrl && (
          <div className="mb-4 p-4 bg-white rounded-xl border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Your ticket QR code:</p>
            <div ref={qrCodeRef} className="flex justify-center">
              <img 
                src={qrCodeDataUrl} 
                alt="Ticket QR Code" 
                className="w-32 h-32 border border-gray-200 rounded"
              />
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={downloadTicket}
            disabled={!qrCodeDataUrl}
            className="w-full bg-blue-500 text-white py-2.5 rounded-xl font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
            Download Ticket
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={printTicket}
            disabled={!qrCodeDataUrl}
            className="w-full bg-white text-blue-500 border border-blue-300 py-2.5 rounded-xl font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <QrCodeIcon className="h-5 w-5 mr-2" />
            Print Ticket
          </motion.button>
          
          <button
            onClick={onNewBooking}
            className="w-full text-blue-500 hover:text-blue-700 py-2.5 rounded-xl font-medium border border-blue-200"
          >
            Book More Tickets
          </button>
        </div>
        
        <style jsx>{`
          .confetti {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 100;
          }
          
          .confetti-piece {
            position: absolute;
            width: 10px;
            height: 10px;
            animation: confetti-fall 3s ease-out forwards;
            opacity: 0.8;
          }
          
          @keyframes confetti-fall {
            0% {
              transform: translateY(-100px) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(500px) rotate(360deg);
              opacity: 0;
            }
          }
        `}</style>
      </motion.div>
    );
  };

export default EventDetails;