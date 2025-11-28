# Oureon MVP - Quick Reference Card

## 🚀 Quick Start Commands

```bash
# Setup (first time only)
npm run setup

# Start Backend
cd server && npm run dev

# Start Frontend (in new terminal)
cd client && npm run dev

# Or use root commands
npm run dev:server  # Backend
npm run dev:client  # Frontend
```

## 🌐 URLs

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 📁 Important Files

### Configuration
- `server/.env` - Backend environment variables
- `client/.env` - Frontend environment variables

### Entry Points
- `server/src/index.js` - Backend server
- `client/src/main.jsx` - Frontend app

## 🔑 Environment Variables

### Backend (server/.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/oureon-mvp
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Frontend (client/.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📡 API Endpoints Quick Reference

### Auth
```
POST   /api/auth/register     Register user
POST   /api/auth/login        Login user
GET    /api/auth/me           Get current user
```

### Tasks (Protected)
```
POST   /api/tasks             Create task
GET    /api/tasks             Get tasks (?scope=today|week|all)
PATCH  /api/tasks/:id         Update task
PATCH  /api/tasks/:id/complete Toggle complete
DELETE /api/tasks/:id         Delete task
```

### Focus (Protected)
```
POST   /api/focus/start       Start session
POST   /api/focus/:id/end     End session
GET    /api/focus/active      Get active session
GET    /api/focus             Get sessions (?range=today|week)
```

### Summary (Protected)
```
GET    /api/summary/daily     Daily summary
GET    /api/summary/weekly    Weekly summary
```

## 🗂️ Project Structure

```
oureon-mvp/
├── server/              Backend (Node + Express)
│   └── src/
│       ├── config/     DB connection
│       ├── models/     Mongoose schemas
│       ├── controllers/ Business logic
│       ├── routes/     API endpoints
│       └── middleware/ Auth & errors
│
└── client/              Frontend (React + Vite)
    └── src/
        ├── pages/      Login, Register, Dashboard
        ├── components/ Tasks, Timer, Summary
        ├── context/    Auth state
        └── utils/      API client
```

## 🎯 Features Checklist

### Authentication
- [x] Register with email/password
- [x] Login with JWT
- [x] Protected routes
- [x] Auto logout on token expiry

### Tasks
- [x] Create with title, description, deadline
- [x] Categorize by project & type
- [x] Mark complete/incomplete
- [x] Edit & delete
- [x] Filter (today/week/all)

### Focus Timer
- [x] Start with mode & duration
- [x] Live countdown
- [x] End with rating & notes
- [x] Session history

### Analytics
- [x] Daily summary
- [x] Weekly summary
- [x] Upcoming deadlines
- [x] Project statistics

## 🛠️ Useful Commands

### Backend
```bash
cd server
npm install              # Install dependencies
npm run dev             # Start with nodemon
npm run lint            # Check code
npm run lint:fix        # Fix linting issues
```

### Frontend
```bash
cd client
npm install              # Install dependencies
npm run dev             # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Check code
npm run lint:fix        # Fix linting issues
```

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Start MongoDB locally
mongod

# Or use MongoDB Atlas and update MONGODB_URI in .env
```

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### JWT Token Issues
- Clear browser localStorage
- Check JWT_SECRET in server/.env
- Verify token hasn't expired

### CORS Issues
- Ensure CLIENT_URL in server/.env matches frontend URL
- Check CORS configuration in server/src/index.js

## 📚 Documentation

- **README.md** - Project overview
- **SETUP.md** - Detailed setup guide
- **CHECKLIST.md** - Implementation checklist
- **PROJECT_STRUCTURE.md** - File structure
- **COMPLETE_SUMMARY.md** - Full summary

## 🎨 UI Components

### Custom Classes (Tailwind)
```css
.btn                 Base button
.btn-primary        Primary action (blue)
.btn-secondary      Secondary (gray)
.btn-danger         Delete action (red)
.input              Form input field
.card               Content card
```

## 📦 Dependencies Summary

### Backend (7 production)
- express, mongoose, dotenv, cors
- bcryptjs, jsonwebtoken
- express-validator

### Frontend (4 production)
- react, react-dom
- react-router-dom, axios

## 🎯 Default Values

### Projects
- Personal (default)
- GA
- Poly
- Oureon

### Task Types
- study (default)
- code
- admin
- life

### Focus Modes
- study (default)
- coding
- review
- exam

### Timer Presets
- 15 minutes
- 25 minutes (Pomodoro)
- 45 minutes
- 60 minutes

## 🔐 Security Features

- [x] Password hashing (bcryptjs)
- [x] JWT authentication
- [x] Protected API routes
- [x] CORS configuration
- [x] Input validation
- [x] XSS protection (React)
- [x] SQL injection protection (Mongoose)

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🎉 Quick Test Workflow

1. Open http://localhost:5173
2. Click "Sign Up"
3. Register: test@example.com / password123
4. Create task: "Learn React"
5. Start 25min focus session
6. End session with 5-star rating
7. View daily summary

## 💡 Tips

- Use quick duration buttons for faster session setup
- Filter tasks by scope to focus on what matters
- Check weekly summary for productivity insights
- Rate your sessions to track focus quality
- Set realistic deadlines for better planning

---

**All documentation**: README.md | SETUP.md | CHECKLIST.md | PROJECT_STRUCTURE.md | COMPLETE_SUMMARY.md

**Need Help?** Check SETUP.md for detailed instructions and troubleshooting.

**Ready to Deploy?** Follow production deployment guide in SETUP.md.
