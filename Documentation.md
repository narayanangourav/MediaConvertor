# 🎵 Media Converter

A modern, full-stack web application for converting text to audio and extracting audio from videos. Built with user authentication, secure file management, and automatic cleanup.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Python](https://img.shields.io/badge/python-3.12-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.121.3-green.svg)
![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Frontend Routes](#frontend-routes)
- [File Management](#file-management)
- [Authentication](#authentication)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### 🎯 Core Features

- **Text to Audio Conversion** - Convert any text to natural-sounding MP3 audio using gTTS
- **Video to Audio Extraction** - Extract high-quality audio tracks from video files
- **User Authentication** - Secure JWT-based authentication system
- **File Management** - Track and manage all user files with metadata
- **Automatic Cleanup** - Files auto-delete after 72 hours
- **Secure Downloads** - Only file owners can download their files

### 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication (30-minute expiry)
- Protected API endpoints
- User-file ownership verification
- CORS configuration for cross-origin requests

### 🎨 UI/UX Features

- Modern, responsive design with Tailwind CSS
- Material-UI components
- Dark mode theme with glassmorphism
- Loading states and animations
- Error handling with user-friendly messages

---

## 🛠️ Tech Stack

### Backend

- **Framework**: FastAPI 0.121.3
- **Server**: Uvicorn (ASGI)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**:
  - `python-jose[cryptography]` for JWT tokens
  - `passlib[bcrypt]==4.1.3` for password hashing
- **Media Processing**:
  - `gTTS` for text-to-speech
  - `moviepy` for video processing
  - `imageio-ffmpeg` for FFmpeg integration
- **Validation**: Pydantic with `email-validator`

### Frontend

- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 7.2.4
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **UI Components**:
  - Material-UI (@mui/material)
  - Material-UI Lab (@mui/lab)
- **Styling**: Tailwind CSS v4
- **Icons**: Material Icons

### Database

- **PostgreSQL** - Production database
- **SQLAlchemy** - ORM for database operations
- **Migrations**: Automatic via SQLAlchemy

---

## 📁 Project Structure

```
MediaConvertor/
├── backend/
│   ├── venv/                  # Python virtual environment
│   ├── uploads/               # Temporary video uploads
│   ├── outputs/               # Converted MP3 files
│   ├── main.py               # FastAPI application
│   ├── models.py             # Database models
│   ├── schemas.py            # Pydantic schemas
│   ├── database.py           # Database configuration
│   ├── requirements.txt      # Python dependencies
│   ├── test_db.py           # Database connection test
│   ├── test_signup.py       # Auth testing
│   └── test_file_management.py  # File system tests
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.tsx          # Landing page
│   │   │   ├── Login.tsx         # Login page
│   │   │   ├── Signup.tsx        # Signup page
│   │   │   ├── Layout.tsx        # App layout wrapper
│   │   │   ├── TextToAudio.tsx   # Text conversion UI
│   │   │   └── VideoToAudio.tsx  # Video conversion UI
│   │   ├── store/
│   │   │   ├── store.ts          # Redux store config
│   │   │   ├── authSlice.ts      # Auth state
│   │   │   └── mediaSlice.ts     # Media conversion state
│   │   ├── App.tsx              # Main app component
│   │   ├── main.tsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── public/                  # Static assets
│   ├── package.json            # Node dependencies
│   ├── vite.config.ts          # Vite configuration
│   ├── tailwind.config.js      # Tailwind config
│   └── postcss.config.js       # PostCSS config
│
├── README.md                   # This file
├── AUTH_COMPLETE.md           # Auth system documentation
├── FILE_STORAGE.md            # File storage details
├── FILE_MANAGEMENT_COMPLETE.md  # File management guide
├── DB_SETUP.md                # Database setup instructions
└── AUTH_TESTING.md            # Testing guide
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.12+** - [Download](https://www.python.org/downloads/)
- **Node.js 20.19+ or 22.12+** - [Download](https://nodejs.org/)
- **PostgreSQL 14+** - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/downloads)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd MediaConvertor
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

---

## 🗄️ Database Setup

### Option 1: Local PostgreSQL

1. **Install PostgreSQL** from [postgresql.org](https://www.postgresql.org/download/)

2. **Create Database**:

   ```bash
   # Open SQL Shell (psql) or use pgAdmin
   CREATE DATABASE mediaconverter;
   ```

3. **Configure Connection** (optional):

   ```bash
   # Set environment variable if credentials differ
   # Windows PowerShell:
   $env:DATABASE_URL="postgresql://username:password@localhost/mediaconverter"

   # macOS/Linux:
   export DATABASE_URL="postgresql://username:password@localhost/mediaconverter"
   ```

### Option 2: Supabase (Cloud Database)

1. Sign up at [supabase.com](https://supabase.com/)
2. Create a new project
3. Get connection string from Project Settings → Database
4. Set as environment variable:
   ```bash
   $env:DATABASE_URL="postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres"
   ```

### Verify Database

```bash
cd backend
.\venv\Scripts\activate
python test_db.py
```

**Expected output:**

```
✅ Database connection successful!
✅ Tables found: ['users', 'media_files']
```

---

## ▶️ Running the Application

### Backend (Terminal 1)

```bash
cd backend
.\venv\Scripts\activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Expected output:**

```
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**API Docs**: http://localhost:8000/docs

### Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

**Expected output:**

```
VITE v7.2.4  ready in 507 ms
➜  Local:   http://localhost:5173/
```

**Application**: http://localhost:5173

---

## 🌐 API Endpoints

### Authentication Endpoints

#### 1. **Sign Up**

```http
POST /signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

---

#### 2. **Login**

```http
POST /token
Content-Type: application/x-www-form-urlencoded

username=user@example.com&password=securepassword
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

---

### Media Conversion Endpoints

#### 3. **Text to Audio**

```http
POST /convert/text-to-audio
Authorization: Bearer {token}
Content-Type: application/json

{
  "text": "Hello, this is a test.",
  "language": "en"
}
```

**Response:**

```json
{
  "url": "http://localhost:8000/download/abc123-uuid.mp3",
  "filename": "abc123-uuid.mp3"
}
```

---

#### 4. **Video to Audio**

```http
POST /convert/video-to-audio
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: (binary video file)
```

**Response:**

```json
{
  "url": "http://localhost:8000/download/def456-uuid.mp3",
  "filename": "def456-uuid.mp3"
}
```

---

### File Management Endpoints

#### 5. **List My Files**

```http
GET /my-files
Authorization: Bearer {token}
```

**Response:**

```json
{
  "total": 3,
  "files": [
    {
      "filename": "abc123-uuid.mp3",
      "original_name": "video.mp4",
      "file_type": "video_to_audio",
      "file_size": 1234567,
      "created_at": "2025-11-23T15:30:00",
      "download_url": "http://localhost:8000/download/abc123-uuid.mp3"
    }
  ]
}
```

---

#### 6. **Download File**

```http
GET /download/{filename}
Authorization: Bearer {token}
```

**Response:** Binary audio file (audio/mpeg)

**Security:** Only the file owner can download. Returns 404 if:

- File doesn't exist
- User doesn't own the file
- User is not authenticated

---

### Health Check

#### 7. **Root Endpoint**

```http
GET /
```

**Response:**

```json
{
  "message": "Media Converter API is running"
}
```

---

## 🗺️ Frontend Routes

| Route             | Component          | Auth Required | Description                        |
| ----------------- | ------------------ | ------------- | ---------------------------------- |
| `/`               | `Home.tsx`         | No            | Landing page with feature overview |
| `/login`          | `Login.tsx`        | No            | User login form                    |
| `/signup`         | `Signup.tsx`       | No            | User registration form             |
| `/text-to-audio`  | `TextToAudio.tsx`  | ✅ Yes        | Text to audio conversion           |
| `/video-to-audio` | `VideoToAudio.tsx` | ✅ Yes        | Video to audio extraction          |

**Protected Routes**: Automatically redirect to `/login` if user is not authenticated.

---

## 📦 File Management

### File Lifecycle

1. **Creation**:

   - User converts text or uploads video
   - File saved to `backend/outputs/{uuid}.mp3`
   - Database record created in `media_files` table

2. **Storage**:

   - Files stored locally in `backend/outputs/`
   - Metadata tracked in PostgreSQL
   - Linked to user account

3. **Access**:

   - Only authenticated users can download
   - Only file owner can access their files
   - Token verified on every download

4. **Cleanup**:
   - Files >72 hours old are auto-deleted
   - Cleanup runs on server startup
   - Both file and DB record removed

### Storage Locations

- **Temporary Uploads**: `backend/uploads/` (videos, deleted after conversion)
- **Converted Files**: `backend/outputs/` (MP3 files, kept for 72 hours)

### Database Schema

**Users Table:**

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    hashed_password VARCHAR NOT NULL
);
```

**Media Files Table:**

```sql
CREATE TABLE media_files (
    id SERIAL PRIMARY KEY,
    filename VARCHAR NOT NULL,
    original_name VARCHAR,
    file_type VARCHAR,
    file_size INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 🔐 Authentication

### JWT Token System

**Token Generation:**

- Created upon signup/login
- Contains: `{"sub": "user@email.com", "exp": timestamp}`
- Signed with `HS256` algorithm
- Expires in 30 minutes

**Token Storage:**

- Frontend: `localStorage.getItem('token')`
- Sent in header: `Authorization: Bearer {token}`

**Token Validation:**

- Every protected endpoint verifies token
- Checks signature, expiry, and user existence
- Returns 401 if invalid

### Password Security

- **Hashing**: bcrypt (cost factor 12)
- **Storage**: Only hashed passwords in database
- **Verification**: Time-constant comparison

---

## 🧪 Testing

### Backend Tests

**1. Database Connection:**

```bash
cd backend
python test_db.py
```

**2. Authentication:**

```bash
python test_signup.py
```

**3. File Management:**

```bash
python test_file_management.py
```

### Frontend Testing

1. **Manual Testing**:

   - Sign up new user
   - Log in
   - Convert text to audio
   - Upload video
   - Download files
   - Log out

2. **Browser Console**:
   - Check Network tab for API calls
   - Verify token in Application → Local Storage
   - Check for JavaScript errors

---

## 🚀 Deployment

### Backend Deployment

**Prepare for Production:**

1. **Set Environment Variables:**

   ```bash
   export SECRET_KEY="your-very-secure-secret-key-here"
   export DATABASE_URL="postgresql://user:pass@host/db"
   export ALLOWED_ORIGINS="https://yourdomain.com"
   ```

2. **Update CORS:**

   ```python
   # main.py
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://yourdomain.com"],  # Production domain
       ...
   )
   ```

3. **Use Production ASGI Server:**
   ```bash
   gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
   ```

**Deployment Platforms:**

- **Railway** - Easy Python deployment
- **Render** - Free tier available
- **AWS EC2** - Scalable cloud hosting
- **DigitalOcean** - Simple VPS
- **Heroku** - With PostgreSQL addon

### Frontend Deployment

**Build for Production:**

```bash
cd frontend
npm run build
```

**Deploy to:**

- **Vercel** - Recommended for Vite/React
- **Netlify** - Simple static hosting
- **Cloudflare Pages** - Fast CDN
- **AWS S3 + CloudFront** - Enterprise option

**Update API URL:**

```typescript
// In frontend components
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
```

---

## 🐛 Troubleshooting

### Backend Issues

**Port 8000 already in use:**

```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8000 | xargs kill -9
```

**bcrypt import error:**

```bash
pip uninstall bcrypt -y
pip install bcrypt==4.1.3
```

**Database connection failed:**

```bash
# Check PostgreSQL is running
# Windows: Services → PostgreSQL
# macOS: brew services list
# Linux: systemctl status postgresql

# Test connection
python test_db.py
```

### Frontend Issues

**Node version error:**

```bash
# Update Node.js to 20.19+ or 22.12+
node --version
```

**Port 5173 in use:**

- Frontend will automatically use next available port (5174, 5175, etc.)
- Check terminal output for actual port

**CORS errors:**

- Ensure backend is running
- Check backend CORS configuration
- Verify API URL in frontend

---

## 📊 Performance Considerations

### Backend

- File uploads limited by server memory
- Video processing is CPU-intensive
- Consider adding file size limits
- Use task queue (Celery) for large conversions

### Frontend

- Files loaded on-demand
- Lazy loading for components
- Optimized bundle with Vite code splitting

### Database

- Indexes on `email`, `user_id`, `created_at`
- Automatic cleanup prevents table bloat
- Consider archiving old records

---

## 🔮 Future Enhancements

### Planned Features

- [ ] Background task queue for conversions
- [ ] File sharing with temporary links
- [ ] Storage quotas per user
- [ ] Multiple languages for TTS
- [ ] Batch file processing
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] Cloud storage integration (S3/GCS)
- [ ] Real-time conversion progress
- [ ] Audio editing capabilities

### Technical Improvements

- [ ] API rate limiting
- [ ] Redis caching
- [ ] WebSocket for live updates
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Automated tests suite
- [ ] Monitoring and logging
- [ ] Load balancing

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**Development Guidelines:**

- Follow PEP 8 for Python code
- Use ESLint/Prettier for TypeScript
- Write meaningful commit messages
- Add tests for new features
- Update documentation

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Your Name** - Initial work

---

## 🙏 Acknowledgments

- FastAPI for the excellent web framework
- Material-UI for beautiful React components
- gTTS for text-to-speech conversion
- MoviePy for video processing
- PostgreSQL team for reliable database
- React and Vite communities

---

## 📞 Support

For issues, questions, or suggestions:

- Open an issue on GitHub
- Email: your.email@example.com
- Documentation: See `/docs` folder

---

## 📈 Project Stats

- **Lines of Code**: ~3,000+
- **API Endpoints**: 7
- **Frontend Routes**: 5
- **Database Tables**: 2
- **Dependencies**: 30+
- **File Types Supported**: MP4, AVI, MOV, MKV (video)

---

**Built with ❤️ using FastAPI, React, and PostgreSQL**

---

## Quick Start Checklist

- [ ] PostgreSQL installed and running
- [ ] Database `mediaconverter` created
- [ ] Backend virtual environment activated
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend running on port 8000
- [ ] Frontend running on port 5173
- [ ] Can create account
- [ ] Can convert text to audio
- [ ] Can convert video to audio
- [ ] Can download files

**Need help?** Check the [Troubleshooting](#troubleshooting) section or open an issue.
