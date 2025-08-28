import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, CalendarIcon, MapPinIcon, TicketIcon } from '@heroicons/react/24/outline';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
        >
          EventFlow
        </motion.div>
        <div className="hidden md:flex space-x-8">
          <a href="#features" className="hover:text-purple-300 transition-colors">Features</a>
          <a href="/events" className="hover:text-purple-300 transition-colors">Events</a>
          <a href="#contact" className="hover:text-purple-300 transition-colors">Contact</a>
        </div>
        <div className="flex space-x-4">
          <Link to="/login" className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors">
            Login
          </Link>
          <Link to="/register" className="px-4 py-2 rounded-lg bg-white text-purple-900 font-medium hover:bg-gray-100 transition-colors">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 flex flex-col items-center text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl md:text-7xl font-bold mb-6"
        >
          Discover & Book
          <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Amazing Events
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-xl text-gray-300 mb-10 max-w-3xl"
        >
          Experience the future of event booking with seamless registration, real-time availability, and instant confirmations.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link 
            to="/events" 
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center"
          >
            Explore Events <ChevronRightIcon className="w-5 h-5 ml-2" />
          </Link>
          <button className="px-8 py-4 border border-white/20 rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors">
            Learn More
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-16 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl -z-10"></div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
            <img 
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" 
              alt="Event showcase" 
              className="rounded-xl shadow-2xl"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/5">
        <div className="container mx-auto px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl font-bold text-center mb-16"
          >
            Why Choose EventFlow?
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <TicketIcon className="w-12 h-12" />,
                title: "Instant Booking",
                description: "Secure your spot instantly with our seamless booking system and real-time availability updates."
              },
              {
                icon: <CalendarIcon className="w-12 h-12" />,
                title: "Smart Calendar",
                description: "Never miss an event with personalized recommendations and calendar integration."
              },
              {
                icon: <MapPinIcon className="w-12 h-12" />,
                title: "Venue Maps",
                description: "Easy navigation with integrated maps and venue information for every event."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="text-blue-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl p-12 border border-white/10"
          >
            <h2 className="text-3xl font-bold mb-6">Ready to Experience Events Like Never Before?</h2>
            <p className="text-xl text-gray-300 mb-8">Join thousands of users who trust EventFlow for their event bookings.</p>
            <Link 
              to="/register" 
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-600 transition-all inline-block"
            >
              Get Started Today
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">© 2025 EventFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;