// src/pages/Admin/Artists.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import DashboardNav from '../../components/DashboardNav';
import api from '../../api/axios';

const ArtistCard = ({ artist, onStatusChange }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative group">
        <img 
          src={artist.profile_picture || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} 
          alt={`${artist.username}'s profile`}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <select
            value={artist.is_artist ? 'active' : 'inactive'}
            onChange={(e) => onStatusChange(artist.username, e.target.value === 'active')}
            className="px-3 py-1 bg-white rounded-full text-sm font-medium shadow-md"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {artist.first_name} {artist.last_name}
            </h3>
            <p className="text-gray-600 text-sm">@{artist.username}</p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-sm">{artist.email}</span>
          </div>
          
          {artist.website && (
            <div className="flex items-center text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <a href={artist.website} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-red-600">
                {artist.website}
              </a>
            </div>
          )}
        </div>

        {artist.bio && (
          <p className="text-gray-600 text-sm mb-4">{artist.bio}</p>
        )}

        <div className="flex justify-between items-center">
          <button 
            onClick={() => window.location.href = `/artists/${artist.username}`}
            className="text-red-600 text-sm font-medium flex items-center hover:text-red-700"
          >
            View Profile
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminArtists = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [artists, setArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const userRole = 'admin';

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const response = await api.get('/api/users/artists/');
      const artistsData = Array.isArray(response.data) ? response.data : response.data.results;
      setArtists(artistsData || []);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching artists:', err);
      setError('Failed to fetch artists');
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (username, isActive) => {
    try {
      await api.patch(`/api/users/${username}/`, {
        is_artist: isActive
      });
    
      // Update local state
      setArtists(prevArtists =>
        prevArtists.map(artist =>
          artist.username === username
            ? { ...artist, is_artist: isActive }
            : artist
        )
      );
    } catch (err) {
      console.error('Error updating artist status:', err);
      alert('Failed to update artist status');
    }
  };

  const filteredArtists = Array.isArray(artists) ? artists.filter(artist =>
    artist?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${artist?.first_name || ''} ${artist?.last_name || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artist?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  console.log('Artists data:', artists);
  console.log('Filtered artists:', filteredArtists);

  return (
    <div className="flex h-screen bg-gray-100">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <Sidebar
        userRole={userRole}
        isCollapsed={isCollapsed}
        isSidebarOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col">
        <DashboardNav 
          userRole={userRole} 
          openSidebar={() => setIsSidebarOpen(true)}
        />
        
        <div className="p-4 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Manage Artists</h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Search artists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading artists...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArtists.length > 0 ? (
                filteredArtists.map(artist => (
                  <ArtistCard
                    key={artist.id}
                    artist={artist}
                    onStatusChange={handleStatusChange}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  {searchTerm ? 'No artists found matching your search.' : 'No artists found.'}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminArtists;
