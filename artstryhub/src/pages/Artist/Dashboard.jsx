import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import DashboardNav from '../../components/DashboardNav';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Palette, Calendar, Users, Star, TrendingUp, Award, MessageSquare } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { format, parseISO } from 'date-fns';

const ArtistDashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalArtworks: 0,
      eventsJoined: 0,
      totalViews: 0,
      averageRating: 0
    },
    activities: [],
    achievements: [],
    analyticsData: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [statsResponse, activitiesResponse, analyticsResponse] = await Promise.all([
        api.get('/api/dashboard/stats/'),
        api.get('/api/dashboard/activities/'),
        api.get('/api/dashboard/analytics/')
      ]);

      setDashboardData({
        stats: statsResponse.data,
        activities: activitiesResponse.data.map(activity => ({
          ...activity,
          time: formatTimeAgo(activity.created_at)
        })),
        analyticsData: analyticsResponse.data
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = parseISO(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const statsCards = [
    { 
      title: 'Total Artworks', 
      value: dashboardData.stats.totalArtworks, 
      icon: Palette, 
      color: 'bg-red-500' 
    },
    { 
      title: 'Events Joined', 
      value: dashboardData.stats.eventsJoined, 
      icon: Calendar, 
      color: 'bg-purple-500' 
    },
    { 
      title: 'Total Views', 
      value: dashboardData.stats.totalViews, 
      icon: Users, 
      color: 'bg-green-500' 
    },
    { 
      title: 'Average Rating', 
      value: dashboardData.stats.averageRating.toFixed(1), 
      icon: Star, 
      color: 'bg-yellow-500' 
    }
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar userRole={"artist"} isCollapsed={isCollapsed} />
      
      <div className="flex flex-col flex-grow overflow-hidden">
        <DashboardNav userRole={"artist"} />
        
        <div className="flex-1 overflow-y-auto p-6">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Artist Dashboard</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={fetchDashboardData}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg"
            >
              <TrendingUp size={16} />
              <span>Refresh Data</span>
            </motion.button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{card.title}</p>
                    <p className="text-2xl font-bold mt-2">{card.value}</p>
                  </div>
                  <div className={`${card.color} p-3 rounded-lg`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Rest of the JSX remains the same, but use dashboardData.activities 
              and dashboardData.achievements instead of static data */}
        </div>
      </div>
    </div>
  );
};

export default ArtistDashboard;
