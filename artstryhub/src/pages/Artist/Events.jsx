import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../../components/Sidebar';
import DashboardNav from '../../components/DashboardNav';
import { Filter, Search } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import EventCard from '../../components/EventCard';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const Events = () => {
  const { currentUser } = useAuth();
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, [filterStatus]);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(
        `/api/events/${filterStatus !== 'all' ? `?status=${filterStatus}` : ''}`
      );
      
      // Transform the data to include all necessary fields
      const transformedEvents = response.data.map(event => ({
        ...event,
        status: event.status.charAt(0).toUpperCase() + event.status.slice(1),
        image: event.image || '/default-event-image.jpg',
        participants_count: event.participants?.length || 0,
        isJoined: event.participants?.includes(currentUser?.id),
        categories: Array.isArray(event.categories) ? event.categories : [],
        requirements: event.requirements || '',
        created_by_name: event.created_by_name || 'Unknown Organizer'
      }));
      
      setEvents(transformedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusFilter = (status) => setFilterStatus(status);
  const handleSearch = (e) => setSearchQuery(e.target.value);

  const filteredEvents = events.filter(
    (event) =>
      (filterStatus === 'all' || event.status.toLowerCase() === filterStatus) &&
      event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoinEvent = async (eventSlug) => {
    try {
      const response = await api.post(`/api/events/${eventSlug}/join/`);
      
      // Update the events state with the new participants count and joined status
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.slug === eventSlug
            ? {
                ...event,
                isJoined: response.data.status === 'joined',
                participants_count: response.data.participants_count
              }
            : event
        )
      );

      // Show success message (optional)
    } catch (error) {
      console.error('Error joining event:', error);
      throw error; // Propagate error to EventCard for local error handling
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className="flex-1 overflow-auto">
        <DashboardNav userRole={"artist"} />
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-3xl font-bold text-gray-800">Events</span>
            <div className="flex gap-2 hidden sm:flex">
              <button
                onClick={() => handleStatusFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm ${
                  filterStatus === 'all' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleStatusFilter('upcoming')}
                className={`px-4 py-2 rounded-lg text-sm ${
                  filterStatus === 'upcoming' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => handleStatusFilter('in progress')}
                className={`px-4 py-2 rounded-lg text-sm ${
                  filterStatus === 'in progress' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => handleStatusFilter('completed')}
                className={`px-4 py-2 rounded-lg text-sm ${
                  filterStatus === 'completed' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                Completed
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : error ? (
            <div className="text-red-600 text-center p-4">{error}</div>
          ) : (
            <AnimatePresence>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onJoinEvent={() => handleJoinEvent(event.slug)}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-500 p-4">
                    No events found
                  </div>
                )}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
