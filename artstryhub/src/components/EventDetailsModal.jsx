import React from 'react';
import { X, Calendar, MapPin, Users, Clock, User } from 'lucide-react';
import { format } from 'date-fns';

const EventDetailsModal = ({ event, onClose }) => {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy - h:mm a');
    } catch (error) {
      return 'Date not available';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <img
            src={event.image || '/default-event-image.jpg'}
            alt={event.title}
            className="w-full h-64 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{event.title}</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-5 h-5 mr-3" />
              <div>
                <p className="font-medium">Start Date</p>
                <p className="text-sm">{formatDate(event.start_date)}</p>
              </div>
            </div>

            <div className="flex items-center text-gray-600">
              <Clock className="w-5 h-5 mr-3" />
              <div>
                <p className="font-medium">End Date</p>
                <p className="text-sm">{formatDate(event.end_date)}</p>
              </div>
            </div>

            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-3" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-sm">{event.location}</p>
              </div>
            </div>

            <div className="flex items-center text-gray-600">
              <Users className="w-5 h-5 mr-3" />
              <div>
                <p className="font-medium">Participants</p>
                <p className="text-sm">
                  {event.participants_count} / {event.max_participants || '∞'} participants
                </p>
              </div>
            </div>

            <div className="flex items-center text-gray-600">
              <User className="w-5 h-5 mr-3" />
              <div>
                <p className="font-medium">Organized by</p>
                <p className="text-sm">{event.created_by_name}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-600 whitespace-pre-line">{event.description}</p>
          </div>

          {event.requirements && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Requirements</h3>
              <p className="text-gray-600 whitespace-pre-line">{event.requirements}</p>
            </div>
          )}

          {event.categories && event.categories.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {event.categories.map((category, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal; 