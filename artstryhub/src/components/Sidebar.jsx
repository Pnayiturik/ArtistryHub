import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  MessageSquare, 
  User, 
  Settings, 
  LogOut,
  ChevronLeft,
  Image,
  UserCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';

const adminMenuItems = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { title: 'Events', icon: Calendar, path: '/admin/events' },
  { title: 'Artists', icon: Users, path: '/admin/artists' },
  { title: 'Feedback', icon: MessageSquare, path: '/admin/feedback' },
  { title: 'Mentorship', icon: User, path: '/admin/mentorship' },
];

const artistMenuItems = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/artist/dashboard' },
  { title: 'Events', icon: Calendar, path: '/artist/events' },
  { title: 'Projects', icon: Image, path: '/artist/projects' },
  { title: 'Settings', icon: Settings, path: '/artist/settings' },
];

const Sidebar = ({ userRole }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await api.get('/api/users/me/');
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response?.status === 401) {
          handleLogout();
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  const menuItems = userRole === 'admin' ? adminMenuItems : artistMenuItems;

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout/', {
        refresh_token: localStorage.getItem('refresh_token')
      });
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/login');
    }
  };

  const handleMouseEnter = () => {
    if (isCollapsed) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (isCollapsed) {
      setIsHovered(false);
    }
  };

  return (
    <motion.div
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } h-screen bg-gray-900 text-white flex flex-col transition-all duration-300 relative`}
      animate={{ width: isCollapsed ? '80px' : '256px' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-red-600 rounded-full p-1 text-white hover:bg-red-700 transition-colors"
      >
        <motion.div
          animate={{ rotate: isCollapsed ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronLeft size={20} />
        </motion.div>
      </button>

      {/* Profile Section */}
      <div className={`p-4 ${isCollapsed ? 'items-center' : ''} flex flex-col gap-2`}>
        <div className="flex items-center justify-center">
          <div onClick={() => navigate(`/`)} className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
            {userData?.profile_image ? (
              <img 
                src={userData.profile_image} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <UserCircle size={32} />
            )}
          </div>
        </div>
        {!isCollapsed && (
          <div className="text-center">
            <h3 className="font-semibold">
              {userData ? `${userData.first_name} ${userData.last_name}` : 'Loading...'}
            </h3>
            <p className="text-xs text-gray-400">
              {userRole ? (userRole.charAt(0).toUpperCase() + userRole.slice(1)) : 'Artist'}
            </p>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <div className="flex-grow overflow-hidden">
        <ul className="py-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.li
                key={item.path}
                whileHover={{ x: 4 }}
                className="relative"
              >
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 space-x-3 ${
                    isActive
                      ? 'bg-red-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  } transition-colors relative group`}
                >
                  <item.icon size={25} />
                  {!isCollapsed && (
                    <span className="transition-opacity duration-200">
                      {item.title}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      className="absolute left-0 top-0 w-1 h-full bg-red-400"
                      layoutId="activeIndicator"
                    />
                  )}
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </div>

      {/* Logout Section */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout} // On click, trigger the navigation to /login
          className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 p-2 rounded-lg transition-colors"
        >
          <LogOut size={25} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
