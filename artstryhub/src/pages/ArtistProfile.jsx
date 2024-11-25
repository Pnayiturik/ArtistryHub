import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import DashboardNav from '../components/DashboardNav';

const ArtistProfile = () => {
  const { username } = useParams();
  const decodedUsername = decodeURIComponent(username);
  const [artist, setArtist] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('artworks');
  
  // Add sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const userRole = localStorage.getItem('userRole') || 'artist'; // Get user role from storage

  useEffect(() => {
    fetchArtistData();
  }, [decodedUsername]);

  const fetchArtistData = async () => {
    try {
      const [artistResponse, artworksResponse] = await Promise.all([
        api.get(`/api/users/${encodeURIComponent(decodedUsername)}/`),
        api.get(`/api/users/${encodeURIComponent(decodedUsername)}/artworks/`)
      ]);

      setArtist(artistResponse.data);
      setArtworks(artworksResponse.data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching artist data:', err);
      setError('Failed to load artist profile');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar userRole={userRole} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl text-gray-600">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="flex h-screen">
        <Sidebar userRole={userRole} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl text-red-600">{error || 'Artist not found'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <Sidebar
        userRole={userRole}
        isSidebarOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNav
          userRole={userRole}
          openSidebar={() => setIsSidebarOpen(true)}
        />

        <div className="flex-1 overflow-y-auto">
          {/* Profile Header */}
          <div className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <img
                  src={artist.profile_picture || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                  alt={`${artist.username}'s profile`}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {artist.first_name} {artist.last_name}
                  </h1>
                  <p className="text-gray-600">@{artist.username}</p>
                  {artist.website && (
                    <a
                      href={artist.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:text-red-700 text-sm mt-1 inline-block"
                    >
                      {artist.website}
                    </a>
                  )}
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex justify-center md:justify-start gap-6 mt-6 border-b">
                <button
                  onClick={() => setActiveTab('artworks')}
                  className={`pb-3 px-1 ${
                    activeTab === 'artworks'
                      ? 'border-b-2 border-red-600 text-red-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Artworks
                </button>
                <button
                  onClick={() => setActiveTab('about')}
                  className={`pb-3 px-1 ${
                    activeTab === 'about'
                      ? 'border-b-2 border-red-600 text-red-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  About
                </button>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {activeTab === 'artworks' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {artworks.map((artwork) => (
                  <div
                    key={artwork.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={`${api.defaults.baseURL}${artwork.image}`}
                      alt={artwork.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {artwork.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {artwork.description}
                      </p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-gray-500 text-sm">
                          {new Date(artwork.created_at).toLocaleDateString()}
                        </span>
                        <Link
                          to={`/artwork/${artwork.id}`}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
                {artworks.length === 0 && (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    No artworks found.
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">About {artist.first_name}</h2>
                <div className="space-y-4">
                  {artist.bio && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Bio</h3>
                      <p className="text-gray-600">{artist.bio}</p>
                    </div>
                  )}
                  {artist.social_media && Object.keys(artist.social_media).length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Social Media</h3>
                      <div className="flex gap-4">
                        {Object.entries(artist.social_media).map(([platform, url]) => (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-600 hover:text-red-700"
                          >
                            {platform}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfile; 