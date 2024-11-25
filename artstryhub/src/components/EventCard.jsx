import React, { useState } from 'react';
import { Share2, Calendar, MapPin, Users, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import EventDetailsModal from './EventDetailsModal';

const EventCard = ({ event, onJoinEvent }) => {
  const [showModal, setShowModal] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy - h:mm a');
    } catch (error) {
      return 'Date not available';
    }
  };

  const handleJoin = async () => {
    try {
      setIsJoining(true);
      await onJoinEvent();
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      >
        <div className="relative group">
          <img
            src={event.image || '/default-event-image.jpg'}
            alt={event.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
              <Share2 className="w-4 h-4 text-gray-600" />
            </button>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              event.status === 'Upcoming' ? 'bg-green-100 text-green-600' :
              event.status === 'In Progress' ? 'bg-blue-100 text-blue-600' :
              'bg-gray-100 text-gray-600'
            }`}>
              {event.status}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium">{event.participants_count}</span>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-sm">{formatDate(event.start_date)}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="text-sm">{event.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-2" />
              <span className="text-sm">
                {event.participants_count} / {event.max_participants || '∞'} participants
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm">{formatDate(event.end_date)}</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => setShowModal(true)}
              className="text-red-600 text-sm font-medium flex items-center hover:text-red-700"
            >
              Show More
              <ChevronRight className="w-4 h-4 ml-1 transform transition-transform" />
            </button>
            <button
              onClick={handleJoin}
              disabled={isJoining}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
                isJoining ? 'bg-gray-300 cursor-not-allowed' :
                event.isJoined 
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {isJoining ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : event.isJoined ? (
                'Leave Event'
              ) : (
                'Join Event'
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Modal */}
      {showModal && (
        <EventDetailsModal 
          event={event} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </>
  );
};

export default EventCard;
