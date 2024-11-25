import React, { useState } from "react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Calendar, 
  Trophy, 
  Users, 
  Tag, 
  Clock, 
  Filter,
  Search,
  ChevronDown,
  Star,
  Heart,
  Share2,
  Award
} from 'lucide-react';

const Challenges = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const challenges = [
    {
      id: 1,
      title: "Digital Painting Contest",
      deadline: "Dec 10, 2024",
      category: "Digital Art",
      prize: "$500",
      participants: 20,
      image: "https://assets.aiimagegenerator.pro/digital-art/cbc93679-00e1-41e1-b8b7-f2d692accee4.webp",
      description: "Create a digital masterpiece that captures the essence of future cities",
      status: "active",
      difficulty: "intermediate",
      requirements: [
        "Original artwork only",
        "Minimum resolution 2000x2000px",
        "Maximum 3 entries per artist"
      ],
      prizeBreakdown: [
        "1st Place: $200",
        "2nd Place: $100",
        "3rd Place: $100"
      ]
    },
    
    {
      id: 2,
      title: "Photography Challenge",
      deadline: "Jan 20, 2025",
      category: "Photography",
      prize: "$800",
      participants: 15,
      image: "https://www.nhm.ac.uk/content/dam/nhmwww/discover/ring-necked-parakeet-uk/ring-necked-parakeet-in-flight-full-width.jpg.thumb.620.620.jpg",
      description: "Capture the beauty of urban wildlife in its natural habitat",
      status: "active",
      difficulty: "beginner",
      requirements: [
        "Minimal post-processing",
        "Must be taken in 2024",
        "RAW file required"
      ],
      prizeBreakdown: [
        "1st Place: $400",
        "2nd Place: $300",
        "3rd Place: $100"
      ]
    },
    {
      id: 3,
      title: "Traditional Art showcase",
      deadline: "Feb 15, 2025",
      category: "Traditional",
      prize: "$1,000",
      participants: 100,
      image: "https://www.icc8.org/images/how-digital-artists-are-redefining-traditional-mediums.jpeg",
      description: "Show your mastery of traditional mediums",
      status: "upcoming",
      difficulty: "advanced",
      requirements: [
        "Any traditional medium accepted",
        "High-quality photos of artwork",
        "Process documentation required"
      ],
      prizeBreakdown: [
        "1st Place: $500",
        "2nd Place: $300",
        "3rd Place: $200"
      ]
    }
  ];

  const categories = ["All", "Digital Art", "Photography", "Traditional", "3D Art", "Animation"];
  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || challenge.category === selectedCategory;
    const matchesFilter = activeFilter === 'all' || challenge.status === activeFilter;
    return matchesSearch && matchesCategory && matchesFilter;
  });

  const ChallengeCard = ({ challenge }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    const getDifficultyColor = (difficulty) => {
      const colors = {
        beginner: 'bg-green-100 text-green-800',
        intermediate: 'bg-yellow-100 text-yellow-800',
        advanced: 'bg-red-100 text-red-800'
      };
      return colors[difficulty] || 'bg-gray-100 text-gray-800';
    };

    return (
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="relative">
          <img 
            src={challenge.image} 
            alt={challenge.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-4 right-4 flex space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              challenge.status === 'active' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
            }`}>
              {challenge.status === 'active' ? 'Active' : 'Upcoming'}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-900">{challenge.title}</h2>
            <div className="flex items-center space-x-2">
              <Trophy className="text-yellow-500" size={20} />
              <span className="font-semibold text-gray-900">{challenge.prize}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                <span>{challenge.deadline}</span>
              </div>
              <div className="flex items-center">
                <Users size={16} className="mr-1" />
                <span>{challenge.participants} participants</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center space-x-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                {challenge.difficulty}
              </span>
              <span className="px-2 py-1 rounded bg-gray-100 text-gray-800 text-xs font-medium">
                {challenge.category}
              </span>
            </div>

            <p className="text-gray-600">{challenge.description}</p>

            <div className={`transition-all duration-300 overflow-hidden ${
              isExpanded ? 'max-h-96' : 'max-h-0'
            }`}>
              <div className="pt-4 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Requirements</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {challenge.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Prize Breakdown</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {challenge.prizeBreakdown.map((prize, index) => (
                      <li key={index} className="flex items-center">
                        <Award size={16} className="mr-2 text-yellow-500" />
                        {prize}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center pt-4 border-t border-gray-100">
            <div className="flex space-x-4">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center space-x-1 ${
                  isLiked ? 'text-red-500' : 'text-gray-600'
                } hover:text-red-500 transition-colors duration-300`}
              >
                <Heart size={18} className={isLiked ? 'fill-current' : ''} />
                <span className="text-sm">Save</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition-colors duration-300">
                <Share2 size={18} />
                <span className="text-sm">Share</span>
              </button>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors duration-300"
            >
              <span className="text-sm font-medium">
                {isExpanded ? 'Show Less' : 'Show More'}
              </span>
              <ChevronDown
                size={16}
                className={`transform transition-transform duration-300 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      <Navbar/>
      
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-950 to-gray-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 mt-6">
            Art Challenges
          </h1>
          <p className="text-xl text-center max-w-3xl mx-auto text-blue-100">
            Push your creative boundaries, compete with fellow artists, and win exciting prizes!
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search challenges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-2  border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>

              <div className="flex bg-gray-100 rounded-lg p-1">
                {['all', 'active', 'upcoming'].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-2 py-1 rounded-md text-sm font-medium capitalize ${
                      activeFilter === filter
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>

        {filteredChallenges.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No challenges found matching your criteria.
            </p>
          </div>
        )}
      </div>

      <Footer/>
    </div>
  );
};

export default Challenges;
