import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import DashboardNav from '../../components/DashboardNav';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Globe, 
  Camera, 
  Brush, 
  Award,
  BookOpen,
  Link,
  Instagram,
  Twitter,
  Facebook,
  Save,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const ArtistSettings = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  
  // Sample user data
  const [userData, setUserData] = useState({
    name: 'Patrick Nayituriki',
    email: 'patricknayituriki@gmail.com',
    phone: '+250 788 987 533',
    bio: 'Self employed with specialisation in digital arts and paintings',
    location: "Kiali-Rwanda",
    website: 'www.pnayituriki.com',
    instagram: '@patricknayituriki',
    twitter: '@patricknayituriki',
    facebook: '@patricknayituriki',
    specializations: ['Digital Art', 'Oil Painting', 'Sculpture'],
    education: [
      {
        degree: 'BDA in Digital Arts',
        institution: 'Art Institute of Rwanda',
        year: '2023'
      }
    ],
    exhibitions: [
      {
        title: 'Modern Perspectives',
        venue: 'Metropolitan Gallery',
        year: '2024'
      }
    ]
  });

  const TabButton = ({ name, icon: Icon, label }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setActiveTab(name)}
      className={`flex items-center p-3 w-full rounded-lg transition-colors ${
        activeTab === name 
          ? 'bg-red-100 text-red-600' 
          : 'hover:bg-gray-100'
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span className="font-medium">{label}</span>
    </motion.button>
  );

  const SuccessAlert = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded"
    >
      Settings saved successfully!
    </motion.div>
  );

  const InputField = ({ label, icon: Icon, type = "text", value, onChange }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type={type}
          value={value}
          onChange={onChange}
          className="pl-10 w-full rounded-lg border border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
        />
      </div>
    </div>
  );

  const ProfileSection = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative">
          <img
            src="https://thumbs.dreamstime.com/b/person-icon-flat-style-man-symbol-person-icon-flat-style-man-symbol-isolated-white-background-simple-people-abstract-icon-118611127.jpg"
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
          <button className="absolute bottom-0 right-0 p-2 bg-red-600 rounded-full text-white hover:bg-red-700">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div>
          <h2 className="text-xl font-bold">{userData.name}</h2>
          <p className="text-gray-600">{userData.email}</p>
        </div>
      </div>

      <InputField label="Full Name" icon={User} value={userData.name} />
      <InputField label="Email" icon={Mail} type="email" value={userData.email} />
      <InputField label="Phone" icon={Phone} value={userData.phone} />
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
        <textarea
          value={userData.bio}
          rows={4}
          className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
        />
      </div>

      <InputField label="Location" icon={Globe} value={userData.location} />
    </div>
  );

  const ProfessionalSection = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Specializations</h3>
        <div className="flex flex-wrap gap-2">
          {userData.specializations.map((spec, index) => (
            <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
              {spec}
            </span>
          ))}
          <button className="px-3 py-1 border-2 border-dashed border-gray-300 rounded-full text-sm text-gray-500 hover:border-gray-400">
            + Add More
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Education</h3>
        {userData.education.map((edu, index) => (
          <div key={index} className="mb-4 last:mb-0">
            <h4 className="font-medium">{edu.degree}</h4>
            <p className="text-gray-600">{edu.institution}</p>
            <p className="text-sm text-gray-500">{edu.year}</p>
          </div>
        ))}
        <button className="mt-4 text-red-600 hover:text-red-700 flex items-center">
          <BookOpen className="w-4 h-4 mr-2" />
          Add Education
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Exhibitions & Awards</h3>
        {userData.exhibitions.map((exhibition, index) => (
          <div key={index} className="mb-4 last:mb-0">
            <h4 className="font-medium">{exhibition.title}</h4>
            <p className="text-gray-600">{exhibition.venue}</p>
            <p className="text-sm text-gray-500">{exhibition.year}</p>
          </div>
        ))}
        <button className="mt-4 text-red-600 hover:text-red-700 flex items-center">
          <Award className="w-4 h-4 mr-2" />
          Add Exhibition/Award
        </button>
      </div>
    </div>
  );

  const SocialSection = () => (
    <div className="space-y-6">
      <InputField label="Website" icon={Link} value={userData.website} />
      <InputField label="Instagram" icon={Instagram} value={userData.instagram} />
      <InputField label="Twitter" icon={Twitter} value={userData.twitter} />
      <InputField label="Facebook" icon={Facebook} value={userData.facebook} />
    </div>
  );

  const SecuritySection = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Change Password</h3>
        <InputField label="Current Password" icon={Lock} type="password" />
        <InputField label="New Password" icon={Lock} type="password" />
        <InputField label="Confirm New Password" icon={Lock} type="password" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600">Add an extra layer of security to your account</p>
            <p className="text-sm text-gray-500">Currently: Disabled</p>
          </div>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Enable
          </button>
        </div>
      </div>
    </div>
  );

  const handleSave = () => {
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar userRole="artist" isCollapsed={isCollapsed} />
      
      <div className="flex flex-col flex-grow">
        <DashboardNav userRole="artist" />
        
        <div className="flex-grow p-6 overflow-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Settings</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Changes
            </motion.button>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Settings Navigation */}
            <div className="col-span-12 md:col-span-3">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <TabButton name="profile" icon={User} label="Profile" />
                <TabButton name="professional" icon={Brush} label="Professional Info" />
                <TabButton name="social" icon={Globe} label="Social Links" />
                <TabButton name="security" icon={Lock} label="Security" />
              </div>
            </div>

            {/* Settings Content */}
            <div className="col-span-12 md:col-span-9">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                {activeTab === 'profile' && <ProfileSection />}
                {activeTab === 'professional' && <ProfessionalSection />}
                {activeTab === 'social' && <SocialSection />}
                {activeTab === 'security' && <SecuritySection />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSuccessAlert && <SuccessAlert />}
    </div>
  );
};

export default ArtistSettings;