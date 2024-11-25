import React, { useState, useEffect, useRef } from 'react';
import { ImageIcon, SearchIcon, FilterIcon, HeartIcon, MessageCircleIcon, StarIcon, Loader, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

const CommentDialog = ({ artwork, isOpen, onClose, onComment }) => {
  const [newComment, setNewComment] = useState('');
  const { currentUser } = useAuth();
  const dialogRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onComment(artwork.id, newComment);
      setNewComment('');
    }
  };

  // Close only when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        ref={dialogRef}
        className="bg-white rounded-lg p-6 w-full max-w-[425px] max-h-[90vh] overflow-hidden"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Comments on {artwork.title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto mb-4">
          {artwork.comments?.length > 0 ? (
            <div className="space-y-4">
              {artwork.comments.map((comment) => (
                <div 
                  key={comment.id} 
                  className="bg-gray-50 p-3 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-sm">{comment.user_name}</span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(comment.created_at), 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">No comments yet</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-2 border rounded-lg"
              disabled={!currentUser}
            />
            <button
              type="submit"
              disabled={!currentUser || !newComment.trim()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50 hover:bg-red-700"
            >
              Post
            </button>
          </div>
          {!currentUser && (
            <p className="text-sm text-gray-500 mt-2">
              Please login to comment
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

const Gallery = () => {
  const { currentUser } = useAuth();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [artworks, setArtworks] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  useEffect(() => {
    fetchGalleries();
    fetchArtworks();
  }, []);

  const fetchGalleries = async () => {
    try {
      const response = await api.get('/api/galleries/');
      setGalleries(response.data);
    } catch (error) {
      console.error('Error fetching galleries:', error);
      toast.error('Failed to load galleries');
    }
  };

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/artworks/');
      setArtworks(response.data);
    } catch (error) {
      console.error('Error fetching artworks:', error);
      setError('Failed to fetch artworks');
      toast.error('Failed to load artworks');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (artworkId) => {
    if (!currentUser) {
      toast.error('Please login to like artworks');
      return;
    }

    try {
      // Make API call
      await api.post(`/api/artworks/${artworkId}/like/`);
      
      // Fetch the updated artwork data
      const response = await api.get(`/api/artworks/${artworkId}/`);
      const updatedArtwork = response.data;

      // Update the artworks state with the new data
      setArtworks(prevArtworks =>
        prevArtworks.map(artwork => {
          if (artwork.slug === artworkId) {
            return {
              ...artwork,
              is_liked: updatedArtwork.is_liked,
              likes_count: updatedArtwork.likes_count
            };
          }
          return artwork;
        })
      );
    } catch (error) {
      console.error('Error liking artwork:', error);
      toast.error('Failed to like artwork');
    }
  };

  const handleComment = async (artworkId, content) => {
    if (!currentUser) {
      toast.error('Please login to comment');
      return;
    }

    try {
      const response = await api.post('/api/comments/', {
        artwork: artworkId,
        content: content
      });

      setArtworks(prevArtworks =>
        prevArtworks.map(artwork => {
          if (artwork.id === artworkId) {
            return {
              ...artwork,
              comments: [...artwork.comments, response.data]
            };
          }
          return artwork;
        })
      );

      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const filters = ['All', ...new Set(galleries.map(gallery => gallery.type))];

  const filteredArtworks = artworks.filter(
    (artwork) =>
      (activeFilter === 'All' || artwork.gallery_type === activeFilter) &&
      (artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       artwork.artist_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-500">
        <Loader className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className='bg-gradient-to-b from-gray-50 to-gray-500'>
      <Navbar />
      <div className="p-10">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl text-gray-800 flex items-center mt-20 font-bold justify-center gap-4">
            Artworks Gallery
          </h1>
          <p className="text-xl text-gray-600 mt-4">
            Explore stunning artworks and creations from our diverse artist community.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center mb-8 space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search artworks or artists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg pl-10"
            />
            <SearchIcon className="absolute left-3 top-3 text-gray-400" size={20} />
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  activeFilter === filter
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredArtworks.map((artwork) => (
            <motion.div
              key={artwork.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <img 
                src={artwork.image} 
                alt={artwork.title} 
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = '/default-artwork.jpg';
                }}
              />
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="text-xl font-semibold">{artwork.title}</h3>
                    <p className="text-gray-600">{artwork.artist_name}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      onClick={() => handleLike(artwork.slug)}
                      whileTap={{ scale: 0.9 }}
                      className={`flex items-center ${
                        artwork.is_liked ? 'text-red-600' : 'text-gray-400'
                      } hover:text-red-700`}
                    >
                      <HeartIcon size={24} className={artwork.is_liked ? 'fill-current' : ''} />
                      <span className="ml-1 text-sm">{artwork.likes_count}</span>
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedArtwork(artwork)}
                      className="text-blue-500 hover:text-blue-700 flex items-center"
                    >
                      <MessageCircleIcon size={24} />
                      <span className="ml-1 text-sm">
                        {artwork.comments?.length || 0}
                      </span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {selectedArtwork && (
          <CommentDialog
            artwork={selectedArtwork}
            isOpen={!!selectedArtwork}
            onClose={() => setSelectedArtwork(null)}
            onComment={handleComment}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Gallery;