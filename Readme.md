# 🚀 SmartBudget - AI-Powered Personal Finance Platform

[![Node.js](https://img.shields.io/badge/Node.js-v18-green)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248)](https://mongodb.com)

**SmartBudget** is a full-stack personal finance web application built with modern technologies. Track income/expenses, analyze credit cards with 15 banking rules + AI charts, predict stocks, set goals, and get AI-powered insights.

Live Demo Ready • Professional UI • Production-Ready Backend • WhatsApp Shareable.

## ✨ Features

### Frontend (Premium Glassmorphism UI)
- **Dashboard**: KPI metrics, charts, quick entry (income/expenses/investments/liabilities)
- **Credit Card Advisor**: 15-rule analysis + Chart.js pies/gauges + upgrade recs
- **AI Advisor**: Personalized financial recommendations
- **Goal Planner**: SIP calculators, projections
- **Stock Predictor**: Live data + predictions
- **Auth**: Login/Register with JWT, theme toggle (dark/light)
- **Shared Navbar**: Pixel-perfect across all pages
- **Responsive**: Mobile-first, animations, loading states

### Backend (Node/Express/MongoDB)
- User auth (email/password + Google OAuth)
- Finance data CRUD
- Stock API integration
- JWT security, CORS enabled
- REST APIs: `/api/auth`, `/api/finance`, `/api/stock`

## 🛠️ Tech Stack
```
Frontend: HTML/CSS/JS | Chart.js | Glassmorphism
Backend: Node.js | Express | MongoDB | JWT | Passport
Dev: Nodemon | dotenv
```
## 🚀 Quick Start (5 seconds)

1. **Clone/Download** project folder
2. **Start Backend** (in VSCode terminal):
   ```
   cd server
   npm install
   npm start
   ```
3. **Open Frontend**: http://localhost:5000/login.html
4. **Register/Login** → Enjoy full app!

**Static Preview** (no server): Open any `client/*.html` in browser (offline charts/navbar work).

## 📁 Structure
```
SmartBudget/
├── client/           # React-like SPA (HTML/JS/CSS)
│   ├── css/          # Premium glassmorphism
│   ├── js/           # Auth, dashboard, credit-card, shared-nav
│   └── *.html        # Pages w/ shared components
├── server/           # Express API
│   ├── routes/       # Auth, finance, stock
│   ├── models/       # User, Finance
│   └── server.js     # CORS/DB/JWT ready
├── TODO.md           # Progress tracker
└── Readme.md         # This file
```

## 🔧 Environment Setup
Copy `server/.env.example` → `server/.env`:
```
MONGO_URI=mongodb://localhost:27017/smartbudget
JWT_SECRET=your-super-secret-jwt-key-here-change-in-prod
GOOGLE_CLIENT_ID=your-google-oauth-id
PORT=5000
```

## 🧪 Testing (All Fixed)
- ✅ **Login**: No network errors, timeout handling
- ✅ **Navbar**: Identical everywhere (shared component)
- ✅ **Credit Cards**: Pro charts, 15 rules, localStorage
- ✅ **Theme**: Dark/light toggle persists
- ✅ **Mobile**: Responsive, touch-friendly

## 📱 Screenshots (Conceptual)
*(Upload your own after testing)*

## 🤝 Contributing
1. Fork repo
2. `git checkout -b feature/xyz`
3. Commit changes
4. Push & PR

---
*Star if useful! Questions? Open issue.*

