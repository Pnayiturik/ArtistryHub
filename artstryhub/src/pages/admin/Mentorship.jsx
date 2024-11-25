// src/pages/Admin/Mentorship.jsx
import React, { useState } from 'react'; // Import useState
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Sidebar from '../../components/Sidebar';
import DashboardNav from '../../components/DashboardNav';

const AdminMentorship = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); // Sidebar state (collapsed or expanded)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar toggle
  const userRole = 'admin'; // Example role
  const navigate = useNavigate(); // Navigation hook

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <Sidebar
        userRole={userRole}
        isCollapsed={isCollapsed}
        isSidebarOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
      />
      
      {/* Dashboard Navigation (Mobile Responsive) */}
      <div className="flex-1 flex flex-col">
        <DashboardNav 
          userRole={userRole} 
          openSidebar={() => setIsSidebarOpen(true)} // Add sidebar toggle function
        /> {/* Pass 'userRole' consistently */}

        {/* Main Content Area */}
        <div className="p-4 md:p-8">
          <h1 className="text-2xl font-bold">Manage Mentorship</h1>
        </div>
      </div>
    </div>
  );
};

export default AdminMentorship;
