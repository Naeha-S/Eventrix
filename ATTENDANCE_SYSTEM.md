# Eventrix Attendance System

## Features

### 📋 Attendance Marking
Each event now has a dedicated attendance marking interface with the following features:

#### 1. **Multiple Search Methods**
- **Search by Name**: Type student name to get instant search results
- **Search by Roll Number**: Enter 9-digit roll number directly
- **Autocomplete Dropdown**: Shows matching students as you type

#### 2. **Real-time Validation**
- ✅ Prevents duplicate check-ins
- ✅ Validates roll number format (9 digits)
- ✅ Shows user-friendly error messages
- ✅ Confirms successful attendance marking

#### 3. **Live Attendance Table**
Displays:
- Student name
- Role (Organizer/Participant/Volunteer)
- Status (Present/Absent)
- Check-in time (automatically recorded)

#### 4. **User Experience**
- **Instant Feedback**: Success/error messages after each action
- **Dropdown Selection**: Click any student from search results to mark attendance
- **Auto-clear**: Form clears after successful submission
- **Visual Indicators**: Color-coded status badges (Green = Present, Red = Absent)

### 🎯 How to Use

1. **From Events Page**: Click "📋 Mark Attendance" button on any event card
2. **Mark Student Present**: 
   - Type student name OR
   - Enter roll number
   - Click "Mark Present"
3. **View Attendance**: See all checked-in students in the table below

### 💾 Backend Integration
- All attendance is saved to the database via `/api/checkins` endpoint
- Persistent across page refreshes
- Real-time synchronization

### 🎨 UI Highlights
- Clean, modern interface
- Responsive design (works on mobile/tablet/desktop)
- Smooth animations and transitions
- Clear visual hierarchy

## Sample Mock Data Included
- 322 students from your CSV
- 12 events with varied statuses
- 9 existing check-ins for completed events
- Ready to use out of the box!

## Quick Access
Every event card now shows:
- Event name & date
- Venue
- Current attendee count
- **"Mark Attendance" button** (NEW!)
- Edit button

Click any attendance button to open the full attendance interface!
