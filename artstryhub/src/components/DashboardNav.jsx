import React, { useState, useEffect } from 'react';
import { UserCircle, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const DashboardNav = ({ userRole, isSidebarOpen, setIsSidebarOpen }) => {
  const [user, setUser] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const response = await api.get('/api/users/me/');
      setUser(response.data);
    };
    fetchUser();
  }, []);

  // Event Handlers for Dropdown Items
  const handleSwitchRole = async () => {
    try {
      const response = await api.patch(`/api/users/me/`, {
        is_artist: userRole !== 'artist'
      });

      setUser(response.data);

      
      // Update local storage or auth context with new role
      const newRole = response.data.is_artist ? 'artist' : 'admin';
      // Assuming you have a way to update the global auth state
      // updateAuthState({ ...currentUser, role: newRole });
      
      // Redirect to appropriate dashboard
      navigate(newRole === 'admin' ? '/admin/artists' : '/dashboard');
    } catch (error) {
      console.error('Error switching role:', error);
      alert('Failed to switch role. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      // Clear any auth tokens from storage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      // Redirect to login
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Failed to logout. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 text-white">
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        ☰
      </button>

      {/* Dashboard Title */}
      <h1 className="text-lg font-bold hidden md:block">
        {userRole ? (userRole.charAt(0).toUpperCase() + userRole.slice(1)) : 'Dashboard'}
      </h1>

      {/* Profile Dropdown */}
      <div className="relative">
        <button 
          className="flex items-center space-x-2 bg-gray-700 px-3 py-2 rounded-md hover:bg-gray-600"
          onClick={() => setDropdownVisible(!dropdownVisible)}
        >
          <UserCircle size={20} />
          <span>{userRole ? (userRole.charAt(0).toUpperCase() + userRole.slice(1)) : 'User'}</span>
          <ChevronDown size={16} />
        </button>

        {/* Dropdown Menu */}
        {dropdownVisible && (
          <div className="absolute right-0 top-full mt-2 bg-gray-800 border border-gray-700 rounded shadow-lg z-10">
            <ul className="text-sm">
              {userRole === 'artist' ? (
                <>
                  <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={() => navigate(`/artists/${user.username}`)}>
                    Profile
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
                    Settings
                  </li>
                </>
              ) : (
                <>
                  <li 
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                    onClick={handleSwitchRole}
                  >
                    Switch to Artist
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                    onClick={() => navigate('/admin/artists')}
                  >
                    Manage Users
                  </li>
                </>
              )}
              <li
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-red-500"
                onClick={handleLogout}
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardNav;
