import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Camera, 
  Calendar, 
  Users, 
  Paintbrush, 
  Trophy,
  Star,
  Heart,
  ArrowRight,
  ChevronRight,
  Zap
} from 'lucide-react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

const Homepage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const featuredArtistRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeInUp');
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe sections for scroll animations
    document.querySelectorAll('.animate-section').forEach((section) => {
      observer.observe(section);
    });

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  const testimonials = [
    {
      name: "Chancelline Niyotugendana",
      role: "Photography Artist",
      text: "ArtistryHub transformed my creative journey. The feedback I receive is invaluable.",
      rating: 5,
    },
    {
      name: "Alain Michael",
      role: "Art Director",
      text: "The challenges push me to explore new techniques and styles. Incredible community!",
      rating: 5,
    },
    {
      name: "Loue Cauveur",
      role: "CEO of DigioRwanda",
      text: "Found amazing mentors here who helped me grow exponentially as an artist.",
      rating: 5,
    },
  ];

  const features = [
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Creative Events",
      description:
        "Join workshops, exhibitions, and networking events tailored for artists.",
      color: "text-blue-500",
      hoverColor: "bg-blue-50",
    },
    {
      icon: <Paintbrush className="h-8 w-8" />,
      title: "Artist Feedback",
      description:
        "Get constructive feedback from peers and industry professionals.",
      color: "text-green-500",
      hoverColor: "bg-green-50",
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "Art Challenges",
      description: "Participate in themed challenges to showcase your skills.",
      color: "text-purple-500",
      hoverColor: "bg-purple-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-400">
      <Navbar />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden bg-gradient-to-r from-blue-900 to-gray-950 text-white h-screen"
      >
        <div className="absolute inset-0 bg-[url('https://img.freepik.com/premium-photo/detailed-closeup-painting-within-artists39-club-unveils-meticulous-artistry-testament-skill-dedication-present-this-creative-hub_209484-19013.jpg')] opacity-40 bg-cover bg-center" />
        <div className="relative container mx-auto px-4 py-24 text-center">
          <div
            className={`transition-all duration-1000 transform ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <motion.h1
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-6xl font-bold mt-40 mb-6"
            >
              Welcome to ArtistryHub
            </motion.h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Your creative sanctuary for artistic growth, collaboration, and
              inspiration.
            </p>
            <div className="flex gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-red-500 px-8 py-3 hover:bg-red-500 hover:text-white rounded-full font-semibold hover:bg-blue-50 transition-colors duration-300 flex items-center gap-2"
                onClick={() => navigate("/login")}
              >
                Get Started <ArrowRight className="h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-red-500 text-white px-8 py-3 hover:bg-red-500 hover:text-white rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-300"
                onClick={() => navigate("/about-us")}
              >
                Learn More
              </motion.button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 animate-section">
        <h2 className="text-4xl text-blue-950 font-bold text-center mb-12">Why Choose ArtistryHub?</h2>
        <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              <Card 
                className={`hover:shadow-xl transition-all duration-300 ${hoveredFeature === index ? feature.hoverColor : ''}`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <CardHeader>
                  <div className={`${feature.color} mb-4 transition-transform duration-300 ${hoveredFeature === index ? 'scale-110' : ''}`}>
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Artists Section */}
      <section id="artists" className="bg-gray-900 text-white py-20 animate-section">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Artists</h2>
          <div ref={featuredArtistRef} className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <motion.div 
                key={item} 
                className="group relative overflow-hidden rounded-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={`https://assets.navkarartistryhub.com/paintings/impressionism-paintings/sunlit-serenity-1.jpeg`}
                  alt={`Featured Artist ${item}`}
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold">Art {item}</h3>
                    <p className="text-sm text-gray-300">Digital Art • Photography</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-20 animate-section">
        <h2 className="text-3xl font-bold text-center mb-12">What Artists Say</h2>
        <div className="max-w-3xl mx-auto relative">
          <AnimatePresence mode="wait">
            {testimonials.map((testimonial, index) => (
              index === activeTestimonial && (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="text-center p-8">
                    <CardContent>
                      <div className="flex justify-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                      <p className="text-lg mb-4 italic">"{testimonial.text}"</p>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-900 to-gray-800 text-white py-16 animate-section">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6">Ready to Join Our Creative Community?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Start your artistic journey today and connect with fellow creators worldwide.
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-red-500 px-8 py-3 rounded-full font-semibold hover:bg-red-500 hover:text-white transition-colors duration-300 flex items-center gap-2 mx-auto"
              onClick={() => navigate("/login")}
           >
              Join ArtistryHub <ChevronRight className="h-5 w-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Latest Updates Alert */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="fixed bottom-4 right-4 max-w-sm"
      >
      </motion.div>

      <Footer />
    </div>
  );
};

export default Homepage;