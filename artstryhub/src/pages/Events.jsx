import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, PlusCircle, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/events/');
      console.log('Raw API response:', response.data);

      const formattedEvents = response.data.map(event => ({
        ...event,
        formattedDate: format(new Date(event.start_date), 'PPP'),
        image: event.image || '/default-event.jpg',
        participants_count: event.participants_count || 0,
        is_joined: event.is_joined || false,
        status: event.status || 'Upcoming'
      }));
      console.log('Formatted events:', formattedEvents);
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Current events state:', events);
  }, [events]);

  console.log('Rendering with events:', events);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-500">
        <Loader className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 max-w-7xl"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 mb-4 mt-10">
            Upcoming Events
          </h1>
          <p className="text-gray-600 text-lg mt-4">
            Join our creative community events and workshops
          </p>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(events) && events.length > 0 ? (
            events.map((event) => (
              <motion.div
                key={event.id}
                whileHover={{ y: -5 }}
                className="transition-all duration-300"
              >
                <Card className="overflow-hidden bg-white hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-56 object-cover"
                      onError={(e) => {
                        e.target.src = '/default-event.jpg';
                      }}
                    />
                    <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full">
                      <span className="text-sm font-semibold text-purple-600">
                        {event.status}
                      </span>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-800 mb-2">
                      {event.title}
                    </CardTitle>
                    <CardDescription className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-red-500" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                        <span>{event.formattedDate}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-2 text-green-500" />
                        <span>{event.participants_count} Participants</span>
                      </div>
                    </CardDescription>
                    <div className="mt-4 flex justify-between items-center">
                      <button
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
                          event.is_joined
                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                            : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                        }`}
                      >
                        {event.is_joined ? 'Leave Event' : 'Join Event'}
                      </button>
                      <button 
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => navigate(`/events/${event.slug}`)}
                      >
                        <span className="text-sm underline">Details</span>
                      </button>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <div className="text-gray-400 text-center">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-xl font-semibold mb-2">No Events Found</p>
                <p className="text-sm">Check back later for upcoming events</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
      <Footer />
    </div>
  );
};

export default Events;
