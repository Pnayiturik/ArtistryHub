#ArtistryHub
ArtistryHub is a collaborative platform designed to empower African artists by providing tools and opportunities to connect, collaborate, and showcase their creative works. The platform allows users to pre-release their art for feedback, engage in creative challenges, and build meaningful connections with a vibrant community of peers.

Table of Contents
Overview
Prerequisites
Installation
Clone the Repository
Backend Setup
Frontend Setup
Environment Variables
Backend Variables
Frontend Variables
Project Structure
Key Features
User Management
Creative Collaboration
Notifications
Artistic Showcase
API Documentation
Common Issues & Solutions
Contributing
License
Support
Acknowledgments
Overview
ArtistryHub streamlines collaboration among artists through these standout features:

Pre-release Feedback: Share and receive feedback on your work before official release.
Creative Collaboration: Connect with fellow artists for joint projects.
Showcase: Build your portfolio and showcase your art to a global audience.
Role-based Access Control: Tailored experiences for Admins, Artists, and Reviewers.
Real-time Notifications: Stay updated on feedback, collaboration requests, and announcements.
Custom User Settings: Personalize your experience and manage your profile.
ArtistryHub is designed to inspire creativity and support artists at every stage of their journey.

Prerequisites
Ensure the following tools are installed on your system:

Python (Version 3.8+)
Node.js (Version 16+)
npm or yarn
Git
Installation
1. Clone the Repository
To get started, clone the repository to your local machine:
git clone https://github.com/Pnayiturik/ArtistryHub.git
cd ArtistryHub
2. Backend Setup
Navigate to the backend directory and set up the server:
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
3. Frontend Setup
Navigate to the frontend directory and set up the UI:
cd ../frontend
npm install
npm run dev
Environment Variables
Environment variables are used to configure sensitive settings for the application.

Backend
Create a .env file in the backend directory with the following variables:
SECRET_KEY=YOUR_SECRET_KEY
DATABASE_URL=YOUR_DATABASE_URL
DEBUG=True
CORS_ALLOWED_ORIGINS=http://localhost:3000
Frontend
Create a .env file in the frontend directory with the following variables:
VITE_API_URL=http://localhost:8000/api


