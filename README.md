# Jobie — Full-Stack Job Board

A professional job board with two user roles, resume uploads, and email notifications.

## Tech Stack
- **Frontend:** React + Vite + Tailwind CSS + React Router
- **Backend:** Node.js + Express + MongoDB + JWT
- **File Upload:** Multer + Cloudinary (PDF resumes)
- **Email:** Nodemailer + Gmail

## Features
- Register as **Job Seeker** or **Company**
- Companies: post jobs, view applicants, update application status
- Applicants: browse/search jobs, apply with resume + cover letter, track application status
- Email notifications when status changes
- Responsive — works on mobile

## Setup

### 1. Backend
```bash
cd backend
cp .env.example .env
# Fill in your values in .env
npm install
npm run dev
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Environment Variables (backend/.env)

| Variable | Where to get it |
|---|---|
| `MONGO_URI` | mongodb.com/atlas (free) or local MongoDB |
| `JWT_SECRET` | any random string |
| `CLOUDINARY_*` | cloudinary.com (free account) |
| `EMAIL_USER` | your Gmail |
| `EMAIL_PASS` | Gmail App Password (myaccount.google.com → Security → App Passwords) |

## Folder Structure
```
job-board/
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── auth/      → Login, Register
│       │   ├── public/    → JobsPage, JobDetail
│       │   ├── applicant/ → Dashboard, MyApplications
│       │   └── company/   → Dashboard, PostJob, ViewApplicants
│       ├── components/common/DashboardLayout.jsx
│       ├── context/AuthContext.jsx
│       └── utils/api.js
└── backend/
    ├── models/    → User, Job, Application
    ├── routes/    → auth, jobs, applications
    ├── middleware/→ auth, upload
    └── utils/     → email
```
