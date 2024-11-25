import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import DashboardNav from '../../components/DashboardNav';
import { 
  Upload, 
  Image as ImageIcon, 
  Plus, 
  Filter, 
  Calendar,
  MessageSquare,
  ThumbsUp,
  Eye,
  MoreVertical,
  Edit,
  Trash2,
  PlusCircle,
  Search,
  FolderOpen,
  X,
  FolderX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';

const EditModal = ({ artwork, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: artwork.title,
    description: artwork.description,
    gallery: artwork.gallery,
    status: artwork.status,
  });
  const [galleries, setGalleries] = useState([]);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const response = await api.get('/api/galleries/');
        setGalleries(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGalleries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.patch(`/api/artworks/${artwork.slug}/`, formData);
      onUpdate(response.data);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to update artwork');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-lg p-6 w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">Edit Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Project Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1 w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="mt-1 w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            >
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Gallery</label>
            <select
              name="gallery"
              value={formData.gallery}
              onChange={handleInputChange}
              className="mt-1 w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            >
              {galleries.map(gallery => (
                <option key={gallery.id} value={gallery.id}>
                  {gallery.name} - {gallery.type}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border p-2 border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const ProjectCard = ({ project, onDelete, onUpdate }) => {
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <div className="relative group">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button 
            onClick={() => setShowEditModal(true)}
            className="p-2 bg-white rounded-full m-1 hover:bg-gray-100"
          >
            <Edit className="w-5 h-5 text-gray-700" />
          </button>
          <button 
            onClick={() => onDelete(project.slug)}
            className="p-2 bg-white rounded-full m-1 hover:bg-gray-100"
          >
            <Trash2 className="w-5 h-5 text-red-500" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">{project.title}</h3>
          <span className={`text-sm px-2 py-1 rounded-full ${
            project.status === 'completed' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {project.status === 'completed' ? 'Completed' : 'In Progress'}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4">{project.gallery_type}</p>
        
        <div className="flex justify-between items-center text-gray-500 text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <ThumbsUp className="w-4 h-4 mr-1" />
              <span>{project.likes_count}</span>
            </div>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{new Date(project.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showEditModal && (
          <EditModal
            artwork={project}
            onClose={() => setShowEditModal(false)}
            onUpdate={onUpdate}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ArtistProjects = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); // State for sidebar collapse
  const [projects, setProjects] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [galleryFilter, setGalleryFilter] = useState('all');
  const [galleries, setGalleries] = useState([]);

  // Sample project data
  const sampleProjects = [
    {
      id: 1,
      title: "Abstract Landscape",
      image: "https://i.etsystatic.com/7895875/r/il/5c39cb/2193045070/il_570xN.2193045070_3b2c.jpg",
      category: "Painting",
      likes: 245,
      views: 1200,
      comments: 45,
      date: "2024-03-15",
      status: "completed"
    },
    {
      id: 2,
      title: "Digital Portrait",
      image: "https://cdn-0.shelleyhannafineart.com/wp-content/uploads/2020/03/face3.jpg",
      category: "Digital Art",
      likes: 189,
      views: 890,
      comments: 32,
      date: "2024-03-20",
      status: "in-progress"
    }
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/api/artworks/my-artworks/');
        setProjects(response.data);
      } catch (err) {
        setError('Failed to load projects');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const response = await api.get('/api/galleries/');
        setGalleries(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGalleries();
  }, []);

  const handleDelete = async (slug) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/api/artworks/${slug}/`);
        setProjects(projects.filter(p => p.slug !== slug));
      } catch (err) {
        console.error(err);
        alert('Failed to delete project');
      }
    }
  };

  const handleUpdate = (updatedProject) => {
    setProjects(projects.map(p => 
      p.slug === updatedProject.slug ? updatedProject : p
    ));
  };

  const UploadModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      gallery: '',
      status: 'in-progress',
      image: null
    });
    const [galleries, setGalleries] = useState([]);
    const [showNewGalleryForm, setShowNewGalleryForm] = useState(false);
    const [newGalleryData, setNewGalleryData] = useState({
      name: '',
      type: '',
      description: ''
    });

    useEffect(() => {
      const fetchGalleries = async () => {
        try {
          const response = await api.get('/api/galleries/');
          setGalleries(response.data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchGalleries();
    }, []);

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const form = new FormData();
        Object.keys(formData).forEach(key => {
          if (formData[key] !== null) {
            form.append(key, formData[key]);
          }
        });

        const response = await api.post('/api/artworks/', form, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });

        setProjects([...projects, response.data]);
        setShowUploadModal(false);
      } catch (err) {
        console.error(err);
        alert('Failed to upload project');
      }
    };

    const handleInputChange = (e) => {
      const { name, value, files } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: files ? files[0] : value
      }));
    };

    const handleCreateGallery = async (e) => {
      e.preventDefault();
      try {
        const response = await api.post('/api/galleries/', newGalleryData);
        setGalleries([...galleries, response.data]);
        setFormData(prev => ({ ...prev, gallery: response.data.id }));
        setShowNewGalleryForm(false);
        setNewGalleryData({ name: '', type: '', description: '' });
      } catch (err) {
        console.error(err);
        alert('Failed to create gallery');
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          className="bg-white rounded-lg p-6 w-full max-w-md"
        >
          <h2 className="text-xl font-bold mb-4">Upload New Project</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Project Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-md border border p-2 border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 w-full p-2 rounded-md border border p-2 border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="mt-1 w-full p-2 rounded-md border border p-2 border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                required
              >
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">Gallery</label>
                <button
                  type="button"
                  onClick={() => setShowNewGalleryForm(true)}
                  className="text-sm text-red-600 hover:text-red-500 flex items-center"
                >
                  <PlusCircle className="w-4 h-4 mr-1" />
                  New Gallery
                </button>
              </div>
              {!showNewGalleryForm ? (
                <select
                  name="gallery"
                  value={formData.gallery}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 rounded-md border border p-2 border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                >
                  <option value="">Select a gallery</option>
                  {galleries.map(gallery => (
                    <option key={gallery.id} value={gallery.id}>
                      {gallery.name} - {gallery.type}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="mt-2 space-y-3 border-2 border-gray-200 rounded-md p-3">
                  <h3 className="font-medium text-sm text-gray-700">Create New Gallery</h3>
                  <div>
                    <input
                      type="text"
                      placeholder="Gallery Name"
                      value={newGalleryData.name}
                      onChange={(e) => setNewGalleryData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                      required
                    />
                  </div>
                  <div>
                    <select
                      value={newGalleryData.type}
                      onChange={(e) => setNewGalleryData(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="PHOTO">Photography</option>
                      <option value="DIGITAL">Digital Art</option>
                      <option value="PAINTING">Painting</option>
                      <option value="SCULPTURE">Sculpture</option>
                    </select>
                  </div>
                  <div>
                    <textarea
                      placeholder="Description (optional)"
                      value={newGalleryData.description}
                      onChange={(e) => setNewGalleryData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                      rows={2}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowNewGalleryForm(false)}
                      className="px-3 py-1 text-sm border border p-2 border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleCreateGallery}
                      className="px-3 py-1 text-sm border border-transparent rounded-md text-white bg-red-600 hover:bg-red-700"
                    >
                      Create
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Upload Image</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border p-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer rounded-md font-medium text-red-600 hover:text-red-500">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        name="image"
                        onChange={handleInputChange}
                        className="sr-only"
                        accept="image/*"
                        required
                      />
                    </label>
                  </div>
                  {formData.image && (
                    <p className="text-sm text-gray-500">
                      Selected: {formData.image.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 border border p-2 border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Upload
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filter === 'all' || project.status === filter;
    const matchesGallery = galleryFilter === 'all' || project.gallery === parseInt(galleryFilter);
    
    return matchesSearch && matchesStatus && matchesGallery;
  });

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar userRole={"artist"} isCollapsed={isCollapsed} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-grow overflow-hidden">
        {/* Dashboard Navigation */}
        <DashboardNav userRole={"artist"} />

        <div className="flex-grow p-6 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">My Projects</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUploadModal(true)}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Project
            </motion.button>
          </div>

          <div className="mb-6 space-y-4">
            {/* Search Bar */}
            <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow">
              <Search className="w-5 h-5 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow bg-transparent border-none outline-none text-sm"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap gap-4">
              {/* Status Filter */}
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow">
                <Filter className="w-5 h-5 text-gray-500" />
                <select 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                </select>
              </div>

              {/* Gallery Filter */}
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow">
                <FolderOpen className="w-5 h-5 text-gray-500" />
                <select 
                  value={galleryFilter}
                  onChange={(e) => setGalleryFilter(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm"
                >
                  <option value="all">All Galleries</option>
                  {galleries.map(gallery => (
                    <option key={gallery.id} value={gallery.id}>
                      {gallery.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Active Filters Display */}
              {(searchQuery || filter !== 'all' || galleryFilter !== 'all') && (
                <div className="flex flex-wrap gap-2 items-center">
                  {searchQuery && (
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center">
                      Search: {searchQuery}
                      <X 
                        className="w-4 h-4 ml-2 cursor-pointer" 
                        onClick={() => setSearchQuery('')}
                      />
                    </span>
                  )}
                  {filter !== 'all' && (
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center">
                      Status: {filter}
                      <X 
                        className="w-4 h-4 ml-2 cursor-pointer" 
                        onClick={() => setFilter('all')}
                      />
                    </span>
                  )}
                  {galleryFilter !== 'all' && (
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center">
                      Gallery: {galleries.find(g => g.id === parseInt(galleryFilter))?.name}
                      <X 
                        className="w-4 h-4 ml-2 cursor-pointer" 
                        onClick={() => setGalleryFilter('all')}
                      />
                    </span>
                  )}
                  {(searchQuery || filter !== 'all' || galleryFilter !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setFilter('all');
                        setGalleryFilter('all');
                      }}
                      className="text-red-600 text-sm hover:text-red-800"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <FolderX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No projects found</h3>
                <p className="text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>{showUploadModal && <UploadModal />}</AnimatePresence>
    </div>
  );
};

export default ArtistProjects;
