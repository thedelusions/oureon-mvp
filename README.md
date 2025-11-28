# Oureon MVP

A productivity and focus tracking web application built with the MERN stack.

## What is Oureon MVP?

Oureon is a personal productivity platform that helps you:
- Track and manage tasks across different projects
- Start focused work sessions with timers
- Monitor your productivity with daily and weekly summaries
- Organize work by project (GA, Poly, Oureon, Personal) and type (study, code, admin, life)

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB + Mongoose
- **Auth**: JWT (JSON Web Tokens)

## Project Structure

```
/server     - Backend API (Express + MongoDB)
/client     - Frontend React app (Vite + Tailwind)
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Running the Server

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

Server runs on `http://localhost:5000`

### Running the Client

```bash
cd client
npm install
npm run dev
```

Client runs on `http://localhost:5173`

## Features

- ✅ User authentication (register/login)
- ✅ Task management with projects and types
- ✅ Focus timer sessions with ratings
- ✅ Daily and weekly productivity summaries
- ✅ Responsive design with Tailwind CSS

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks?scope=today|week|all` - Get tasks
- `PATCH /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/complete` - Toggle task completion
- `DELETE /api/tasks/:id` - Delete task

### Focus Sessions
- `POST /api/focus/start` - Start focus session
- `POST /api/focus/:id/end` - End session with rating
- `GET /api/focus/active` - Get active session
- `GET /api/focus?range=today|week` - Get sessions

### Summary
- `GET /api/summary/daily` - Get daily summary
- `GET /api/summary/weekly` - Get weekly summary

## License

MIT
