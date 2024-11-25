import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import About from "./pages/About";
import Challenges from "./pages/Challenges";
import Events from "./pages/Events";
import Collaborations from "./pages/Collaborations";
import Gallery from "./pages/Gallery";
import Login from "./pages/Login";
import Forget from "./pages/forget";
import AdminDashboard from './pages/Admin/Dashboard';
import AdminEvents from './pages/Admin/Events';
import AdminArtists from './pages/Admin/Artists';
import AdminFeedback from './pages/Admin/Feedback';
import AdminMentorship from './pages/Admin/Mentorship';
import ArtistDashboard from './pages/Artist/Dashboard';
import ArtistEvents from './pages/Artist/Events';
import ArtistProjects from './pages/Artist/Projects';
import ArtistSettings from './pages/Artist/Settings';
import Sidebar from "./components/Sidebar";
import EventCard from "./components/EventCard";
import ArtistProfile from "./pages/ArtistProfile";
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/events" element={<Events />} />
          <Route path="/collaborations" element={<Collaborations />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forget" element={<Forget />} />
          {/* Admin Routes */}
          <Route path="/sidebar" element={<Sidebar />}/>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/artists" element={<AdminArtists />} />
          <Route path="/admin/feedback" element={<AdminFeedback />} />
          <Route path="/admin/mentorship" element={<AdminMentorship />} />
          {/* Artist Routes */}
          <Route path="/artist/dashboard" element={<ArtistDashboard />} />
          <Route path="/artist/events" element={<ArtistEvents />} />
          <Route path="/artist/projects" element={<ArtistProjects />} />
          <Route path="/artist/settings" element={<ArtistSettings />} />
          <Route path="/artists/:username" element={<ArtistProfile />} />
          <Route path="/event/cards" element={<EventCard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
