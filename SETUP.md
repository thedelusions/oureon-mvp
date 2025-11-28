# Oureon MVP - Setup Guide

## Quick Start

### 1. Install Dependencies

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd client
npm install
```

### 2. Environment Setup

#### Backend (.env)
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/oureon-mvp
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

#### Frontend (.env)
```bash
cd client
cp .env.example .env
```

Edit `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. MongoDB Setup

**Option A: Local MongoDB**
- Install MongoDB: https://www.mongodb.com/docs/manual/installation/
- Start MongoDB: `mongod`

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `server/.env`

### 4. Run the Application

#### Terminal 1 - Backend
```bash
cd server
npm run dev
```
Server runs on http://localhost:5000

#### Terminal 2 - Frontend
```bash
cd client
npm run dev
```
Client runs on http://localhost:5173

### 5. Test the Application

1. Open http://localhost:5173
2. Register a new account
3. Create tasks
4. Start a focus session
5. View your daily summary

## Project Structure

```
oureon-mvp/
├── server/                 # Backend (Node + Express + MongoDB)
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/    # Auth & error handling
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API routes
│   │   └── index.js       # Server entry point
│   ├── .env.example
│   └── package.json
│
├── client/                # Frontend (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── context/      # Auth context
│   │   ├── pages/        # Page components
│   │   ├── utils/        # API client
│   │   ├── App.jsx       # Main app component
│   │   ├── main.jsx      # Entry point
│   │   └── index.css     # Global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

## API Documentation

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Tasks
- `POST /api/tasks` - Create task (protected)
- `GET /api/tasks?scope=today|week|all` - Get tasks (protected)
- `PATCH /api/tasks/:id` - Update task (protected)
- `PATCH /api/tasks/:id/complete` - Toggle complete (protected)
- `DELETE /api/tasks/:id` - Delete task (protected)

### Focus Sessions
- `POST /api/focus/start` - Start session (protected)
- `POST /api/focus/:id/end` - End session (protected)
- `GET /api/focus/active` - Get active session (protected)
- `GET /api/focus?range=today|week` - Get sessions (protected)

### Summary
- `GET /api/summary/daily` - Daily summary (protected)
- `GET /api/summary/weekly` - Weekly summary (protected)

## Development Scripts

### Backend
```bash
npm run dev      # Start with nodemon
npm start        # Start production
npm run lint     # Run ESLint
npm run lint:fix # Fix ESLint issues
```

### Frontend
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run lint:fix # Fix ESLint issues
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access in MongoDB Atlas

### Port Already in Use
```bash
# Backend (port 5000)
lsof -ti:5000 | xargs kill -9

# Frontend (port 5173)
lsof -ti:5173 | xargs kill -9
```

### CORS Issues
- Ensure `CLIENT_URL` in server `.env` matches your frontend URL
- Check CORS configuration in `server/src/index.js`

### JWT Token Issues
- Ensure `JWT_SECRET` is set in `.env`
- Clear localStorage in browser if token is corrupted

## Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use proper `JWT_SECRET` (strong random string)
3. Use MongoDB Atlas or production MongoDB instance
4. Deploy to: Heroku, Railway, Render, DigitalOcean, etc.

### Frontend
1. Build: `npm run build`
2. Set production `VITE_API_URL` in `.env`
3. Deploy `dist/` folder to: Vercel, Netlify, Cloudflare Pages, etc.

## Features Checklist

- ✅ User authentication (JWT)
- ✅ Task management (CRUD)
- ✅ Task filtering (today/week/all)
- ✅ Task completion tracking
- ✅ Project categorization
- ✅ Type categorization
- ✅ Deadline tracking
- ✅ Focus timer with modes
- ✅ Session tracking
- ✅ Session rating
- ✅ Daily summary
- ✅ Weekly summary
- ✅ Responsive design
- ✅ Tailwind CSS styling

## Next Steps for Enhancement

- [ ] Password reset functionality
- [ ] Email notifications
- [ ] Task priorities
- [ ] Task tags/labels
- [ ] Search functionality
- [ ] Export data (CSV/JSON)
- [ ] Dark mode
- [ ] Mobile app (React Native)
- [ ] Pomodoro timer preset
- [ ] Calendar integration
- [ ] Team collaboration features

## Support

For issues or questions:
1. Check this guide
2. Review error logs
3. Check MongoDB connection
4. Verify environment variables

## License

MIT
