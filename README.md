<<<<<<< HEAD
# Form-Builder
This project is a Resume/Form Builder Platform that allows users to create, customize, preview, and share forms (e.g., resumes, job applications, surveys). It features a React + Tailwind frontend for dynamic drag-and-drop form creation and a Node.js + Express + MongoDB backend to handle form data, submissions, uploads, and analytics.  
=======
# Form Builder — React 18 + TypeScript (Vite) & Node/Express/MongoDB

A drag-and-drop form builder with publishable public forms, file uploads, analytics, CSV export, and a Docker-ready deployment setup.

## Features
- Dashboard: list forms (draft/published), submission count, created date.
- Form Builder: drag-and-drop fields (text, email, select, checkbox, radio, textarea, file).
- Field Config: labels, placeholders, required + validation rules, options for select/radio/checkbox.
- Form Settings: title, description, custom thank-you message, submission limits, redirect URL.
- Preview Mode: test the form before publish.
- Public Forms: responsive, client + server validation, success/error states, redirects.
- File Uploads: image/document with size & type checks.
- Analytics: total submissions, per-day counts; export CSV.
- Security: server-side validation, rate limiting, CORS, Helmet, error structure.
- Docker: docker-compose up for full stack (frontend + backend + MongoDB).

## Stack
**Frontend:** React 18, TypeScript, Vite, TailwindCSS, minimal shadcn-style UI, React Hook Form, Axios/Fetch, @dnd-kit for drag-and-drop, Recharts (hook for future charts).  
**Backend:** Node.js, Express, MongoDB, Mongoose, Multer, Zod (validation), Helmet, CORS, Express-Rate-Limit, Winston.  
**Deployment:** Docker-ready with environment configuration.

---

## Quick Start (Local)

### Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```
Backend on **http://localhost:4000**

### Frontend
```bash
cd ../frontend
npm install
npm run dev
```
Frontend on **http://localhost:5173**

---

## Quick Start (Docker)
```bash
docker compose up --build
```
- Frontend: http://localhost:5173
- Backend: http://localhost:4000

---

## Environment (backend/.env)
```
PORT=4000
MONGO_URI=mongodb://mongo:27017/formbuilder
# For local non-docker: mongodb://127.0.0.1:27017/formbuilder
CORS_ORIGIN=http://localhost:5173
UPLOAD_DIR=src/uploads
MAX_FILE_SIZE_MB=10
```

---

## Modules to Install

### Frontend
```
npm i react react-dom axios react-hook-form zod @hookform/resolvers @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities react-router-dom recharts
npm i -D typescript vite @types/react @types/react-dom tailwindcss postcss autoprefixer
```

### Backend
```
npm i express mongoose multer cors helmet express-rate-limit morgan winston zod dotenv cookie-parser compression dayjs csv-writer
npm i -D nodemon
```

---

## Scripts
- Backend: `npm run dev` (nodemon), `npm start` (prod)
- Frontend: `npm run dev`, `npm run build`, `npm run preview`
>>>>>>> b2af32c (first commit)
