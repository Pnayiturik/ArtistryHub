import React, { useState } from "react";
import Navbar from '../components/Navbar';
import { useNavigate } from "react-router-dom";
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Users, Palette, Trophy, Heart, Mail, ArrowRight, Linkedin, Award} from 'lucide-react';

const About = () => {
  const [activeTab, setActiveTab] = useState('story');
const navigate = useNavigate();
  const stats = [
    { number: "5+", label: "Artists", icon: Users },
    { number: "10+", label: "Artworks", icon: Palette },
    { number: "2+", label: "Events", icon: Trophy },
    { number: "3+", label: "Community", icon: Heart },
  ];

  const team = [
    {
      name: "Patrick Nayituriki",
      role: "Founder & CEO",
      image: "https://cdn-icons-png.flaticon.com/512/56/56832.png",
      bio: "Visionary leader with 5 years in the art industry",
      socials: {
        linkedin: "#",
        Email: "#"
      }
    },
    {
      name: "Sheilla Igiraneza",
      role: "Creative Director",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzPRQ6LprnPzvvP-_vVO_nhSokwda8CMsnwQ&s",
      bio: "Award-winning artist and curator",
      socials: {
        linkedin: "#",
        Email: "#"
      }
    },
    {
      name: "Alain Michael",
      role: "Tech Lead",
      image: "https://cdn-icons-png.flaticon.com/512/56/56832.png",
      bio: "Full-stack developer and art enthusiast",
      socials: {
        linkedin: "#",
        Email: "#"
      }
    },
    {
      name: "Vanessa  Uwonkunda",
      role: "Operation Lead",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzPRQ6LprnPzvvP-_vVO_nhSokwda8CMsnwQ&s",
      bio: "Events manager and operations organizer",
      socials: {
        linkedin: "#",
        Email: "#"
      }
    }
  ];

  const tabContent = {
    story: (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Story</h3>
        <p className="text-gray-600 leading-relaxed">
          Founded in 2024, ArtistryHub emerged from a simple vision: to create a vibrant, 
          inclusive space where artists and art enthusiasts could connect, collaborate, and grow together.
        </p>
        <p className="text-gray-600 leading-relaxed">
          What started as a small community has blossomed into a global platform, 
          hosting virtual exhibitions, workshops, and creative challenges that bring together 
          talented artists from every corner of the world.
        </p>
      </motion.div>
    ),
    mission: (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
        <p className="text-gray-600 leading-relaxed">
          We're on a mission to democratize art by providing tools, opportunities, and 
          platforms for artists to showcase their work, connect with peers, and reach 
          art lovers globally.
        </p>
        <motion.ul 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="space-y-3"
        >
          {["Empower artists to reach global audiences", 
            "Foster creativity and artistic growth",
            "Build meaningful connections in the art community",
            "Make art accessible to everyone"].map((item, index) => (
            <motion.li 
              key={index}
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0 }
              }}
              className="flex items-center space-x-2 text-gray-600"
            >
              <ArrowRight size={16} className="text-blue-500" />
              <span>{item}</span>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    ),
    values: (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Values</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: "Creativity", desc: "Encouraging innovative artistic expression", icon: Award },
            { title: "Community", desc: "Building meaningful connections", icon: Users },
            { title: "Inclusivity", desc: "Welcoming artists from all backgrounds", icon: Heart },
            { title: "Excellence", desc: "Striving for the highest quality", icon: Trophy }
          ].map((value, index) => (
            <motion.div 
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4 hover:shadow-md"
            >
              <value.icon size={32} className="text-blue-500" />
              <div>
                <h4 className="font-semibold text-gray-800">{value.title}</h4>
                <p className="text-gray-600 text-sm mt-1">{value.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-400">
      <Navbar />
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative bg-gradient-to-b from-blue-950 to-gray-500 text-blue-50 py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Empowering Artists Worldwide
          </h1>
          <p className="text-xl text-center max-w-3xl mx-auto text-blue-50 ">
            At ArtistryHub, we are dedicated to connecting artists and art enthusiasts
            through events, challenges, and collaborations. Join us in celebrating
            creativity!
          </p>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 -mt-12 "
      >
        <div className="bg-white rounded-lg shadow-lg p-8 mt-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <stat.icon size={32} className="text-blue-500" />
                </div>
                <div className="text-3xl font-bold text-gray-800">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center mb-12"
        >
          <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg">
            {['story', 'mission', 'values'].map((tab) => (
              <motion.button
                key={tab}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-md text-sm font-medium capitalize transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-white text-blue-600 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <div className="max-w-4xl mx-auto">
          {tabContent[activeTab]}
        </div>

        {/* Team Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="p-6">
                  <motion.img
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 mx-auto rounded-full object-cover shadow-lg"
                  />
                  <div className="text-center mt-4">
                    <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                    <p className="text-blue-600 font-medium">{member.role}</p>
                    <p className="text-gray-600 mt-2 text-sm">{member.bio}</p>
                  </div>
                  <div className="flex justify-center space-x-4 mt-4">
                    <motion.a 
                      whileHover={{ scale: 1.2 }}
                      href={member.socials.linkedin} 
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Linkedin size={20} />
                    </motion.a>
                    <motion.a 
                      whileHover={{ scale: 1.2 }}
                      href={member.socials.email} 
                      className="text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      <Mail size={20} />
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-20 text-center"
        >
          <div className="bg-gray-800 text-white rounded-xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
            <p className="text-blue-100 mb-6">
              Have questions or want to learn more? We'd love to hear from you!
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-red-500 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-300 flex items-center mx-auto"
              onClick={() => navigate("/login")}
            >
              <Mail size={20} className="mr-2" />
              Contact Us
            </motion.button>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default About;