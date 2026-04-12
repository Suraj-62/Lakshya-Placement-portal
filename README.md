# Lakshya Placement Portal 🎯

A premium, AI-powered platform tailored for engineering graduates and students to master algorithmic problem-solving and ace technical interviews. Designed with a sleek, SaaS-like interface and advanced performance analytics, Lakshya bridges the gap between learning and securing top-tier tech placements.

![Lakshya Banner](https://via.placeholder.com/800x200/0a0a0a/ffffff?text=Lakshya+Placement+Portal)

## 🚀 Core Features

- **Live Coding Workspace:** Distraction-free IDE environment powered by Monaco Editor. Write, execute, and evaluate code in multiple programming languages natively.
- **A.I. Career Mentorship:** Intelligent performance profiling powered by **Google Gemini AI**. Analyzes your coding habits and predicts focus areas tailored specifically to your weaknesses.
- **Curated Data Bank:** Extensive, curated library of MCQ and practical algorithm challenges frequently asked in MAANG and product-based software interviews.
- **Advanced Analytics & Dashboards:** Visualize topic mastery with dynamic charts. Track day-streaks, accuracy, and cumulative points to stay motivated.
- **Authentication System:** Secure JWT-based custom login system combined with 1-click **Google OAuth** workflow.
- **Admin Control Panel:** Dedicated dashboard for platform maintainers to supervise user data, analyze platform growth, and regulate technical questions.

## 💻 Tech Stack

### Frontend Hub
- **Core:** Next.js, React.js
- **Styling:** Tailwind CSS (Premium Dark-mode / UI/UX)
- **Visualization:** Recharts
- **Icons & Tooling:** Lucide React, React Hot Toast
- **Coding Interface:** `@monaco-editor/react`

### Backend Engine
- **Runtime:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **AI Integration:** `@google/genai` (Gemini 1.5/2.5 Flash)
- **Security & Middlewares:** JWT, BcryptJS, Helmet, CORS, Express-Rate-Limit

---

## 🛠️ Local Development Setup

To run this application locally, you will need Node.js and a MongoDB instance (cloud/local) set up on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/Suraj-62/Lakshya-Placement-portal.git
cd Lakshya-Placement-portal
```

### 2. Configure Backend
```bash
cd backend
npm install
```
Create a `.env` file inside the strictly `backend` directory and add the following keys:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_strong_secret
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
EMAIL=your_email_address
EMAIL_PASS=your_email_app_password
GEMINI_API_KEY=your_google_gemini_api_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
```
Start the backend server:
```bash
npm run dev
```

### 3. Configure Frontend
Open a new terminal session.
```bash
cd frontend
npm install
```
Create a `.env.local` file inside the strictly `frontend` directory and add:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_BASE_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```
Start the frontend server:
```bash
npm run dev
```
Navigate to `http://localhost:3000` to view the application.

## 🤝 Contributing
Contributions, bug reports, and feature requests are welcome!

## 📜 License
This project is proprietary and built by Suraj Mishra. All rights reserved.