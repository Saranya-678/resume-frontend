# ⚡ ResumeAI — Frontend

Smart AI-powered Resume Analyzer built with React.

## 🚀 Tech Stack
- React 18 (CRA)
- React Router v6
- Axios
- Inline CSS (no external UI library)

## 📁 Folder Structure
```
resume-frontend/
├── public/
│   └── index.html          # HTML shell, fonts loaded here
├── src/
│   ├── api.js              # Axios base config + JWT interceptor
│   ├── App.js              # All routes defined here
│   ├── index.js            # React entry point
│   ├── index.css           # Global base styles
│   ├── components/
│   │   └── Navbar.js       # Fixed top navigation bar
│   └── pages/
│       ├── Login.js        # Login page
│       ├── Register.js     # Register page
│       ├── Dashboard.js    # Stats + top candidates
│       ├── Upload.js       # Upload & analyze resume
│       ├── AllResumes.js   # View / delete all resumes
│       └── Analytics.js    # Charts & insights
├── .env                    # Local dev secrets (not committed)
├── .env.example            # Template for environment variables
├── vercel.json             # Vercel SPA routing fix
└── package.json
```

## 🛠 Local Setup
```bash
npm install
npm start
# Opens at http://localhost:3000
```

## 🌐 Deploy on Vercel
1. Push to GitHub
2. Import repo in Vercel
3. Add Environment Variable: `REACT_APP_API_URL=https://your-backend.up.railway.app`
4. Deploy ✅

## ⚙️ Environment Variables
| Variable | Description |
|---|---|
| `REACT_APP_API_URL` | Your Railway backend base URL |
