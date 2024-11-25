import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBars, FaTimes, FaHome, FaUser, FaCalendar, FaImages, FaUsers } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleProfileClick = () => {
    navigate('/artist/dashboard');
  };

  const NavLinks = () => (
    <>
      <li><Link to="/about-us" className="hover:text-red-500 flex items-center gap-2"><FaUser /> About</Link></li>
      <li><Link to="/challenges" className="hover:text-red-500 flex items-center gap-2"><FaCalendar /> Challenges</Link></li>
      <li><Link to="/events" className="hover:text-red-500 flex items-center gap-2"><FaCalendar /> Events</Link></li>
      <li><Link to="/collaborations" className="hover:text-red-500 flex items-center gap-2"><FaUsers /> Collaborations</Link></li>
      <li><Link to="/gallery" className="hover:text-red-500 flex items-center gap-2"><FaImages /> Gallery</Link></li>
      <li>
        {currentUser ? (
          <button
            onClick={handleProfileClick}
            className="hover:text-red-500 flex items-center gap-2"
          >
            <FaUserCircle /> {currentUser.username}
          </button>
        ) : (
          <Link to="/login" className="hover:text-red-500 flex items-center gap-2">
            <FaUserCircle /> Login
          </Link>
        )}
      </li>
    </>
  );

  if (isMobile) {
    return (
      <header className="bg-gray-900 text-white shadow-lg fixed top-0 left-0 right-0 z-50">
        <nav className="container mx-auto flex justify-between items-center py-3 px-4">
          <button 
            onClick={toggleMenu} 
            className="flex items-center text-xl"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
          <Link to="/" className="text-lg font-bold">ArtistryHub</Link>
          {currentUser ? (
            <button onClick={handleProfileClick} className="text-xl">
              <FaUserCircle />
            </button>
          ) : (
            <Link to="/login" className="text-xl">
              <FaUserCircle />
            </Link>
          )}
        </nav>

        {isOpen && (
          <div className="fixed inset-0 bg-gray-900 z-40 pt-20 px-6">
            <ul className="space-y-6 text-center">
              <NavLinks />
              <li>
                <button 
                  onClick={toggleMenu} 
                  className="mt-6 bg-red-600 text-white px-6 py-2 rounded-lg"
                >
                  Close Menu
                </button>
              </li>
            </ul>
          </div>
        )}
      </header>
    );
  }

  return (
    <header className="bg-gray-900 text-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <nav className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link to="/" className="text-3xl font-bold flex items-center">
          <span className="text-red-500 font-script">Artistry</span>Hub
        </Link>
        <ul className="md:flex gap-6 items-center">
          <NavLinks />
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;