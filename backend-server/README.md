# Eventrix Backend Server

Simple Node.js/Express backend for Eventrix event management system.

## Quick Start

1. **Install dependencies:**
   ```powershell
   npm install
   ```

2. **Start the server:**
   ```powershell
   npm start
   ```

The server will run on `http://localhost:8080`

## Features

- ✅ All CRUD operations for users, events, equipment, bookings, and check-ins
- ✅ Automatically loads all students from `Students_data.csv`
- ✅ In-memory SQLite database (no external dependencies)
- ✅ CORS enabled for frontend
- ✅ Sample events and equipment pre-loaded

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `DELETE /api/users/:id` - Delete user

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Equipment
- `GET /api/equipment` - Get all equipment
- `GET /api/equipment/:id` - Get equipment by ID
- `POST /api/equipment` - Create new equipment
- `PUT /api/equipment/:id` - Update equipment
- `DELETE /api/equipment/:id` - Delete equipment

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create new booking
- `DELETE /api/bookings/:id` - Delete booking

### Check-ins
- `GET /api/checkins` - Get all check-ins
- `POST /api/checkins` - Create new check-in

## Running with Frontend

1. Start backend: `npm start` (in backend-server folder)
2. Start frontend: `npm run dev` (in root folder)
3. Open `http://localhost:5173`

That's it! No Java, no Maven, just simple Node.js! 🎉
