# ArtistryHub

ArtistryHub is a collaborative platform for African artists to connect, showcase their work, and collaborate on creative projects. The platform empowers users with pre-release feedback, creative challenges, and role-based tools tailored to Admins, Artists, and Reviewers.

---

## 🚀 Features

- **Pre-release Feedback**: Upload work for peer review and feedback.
- **Collaboration Tools**: Join and create collaborative art projects.
- **Artistic Portfolios**: Showcase your work in personal galleries.
- **Creative Challenges**: Participate in and host themed contests.
- **Real-time Notifications**: Get updates on feedback and collaborations.
- **Role-based Access**: Tailored tools for Admins, Artists, and Reviewers.

---

## 🛠️ Prerequisites

Make sure the following are installed on your machine:
- **Python**: Version 3.8+
- **Node.js**: Version 16+
- **npm** or **yarn**
- **Git**

---

## ⚙️ Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/ArtistryHub.git
   cd ArtistryHub
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
cd ../frontend
npm install
npm run dev
##Environment Variables
Create .env files in the backend and frontend directories:
SECRET_KEY=your_secret_key
DATABASE_URL=your_database_url
DEBUG=True
CORS_ALLOWED_ORIGINS=http://localhost:3000
##Frontend:
VITE_API_URL=http://localhost:8000/api
Project Structure
ArtistryHub/  
├── backend/   # Django backend for API and business logic  
├── frontend/  # React frontend for user interface  
├── shared/    # Shared assets and configuration  
How to Contribute
Fork the repository.
Create a new branch for your feature
git checkout -b feature-name  
Commit your changes
git commit -m "Add feature-name"  
Push your branch:
git push origin feature-name  
Open a pull request.
##License
ArtistryHub is licensed under the MIT License.
##Support
If you encounter issues or have questions:

Open an issue on GitHub.
Email us at support@artistryhub.com.
##Acknowledgments
We thank the tools and libraries that made this project possible:

Django Rest Framework
React + Vite
TailwindCSS


