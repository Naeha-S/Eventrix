const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const app = express();
const PORT = 8081;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database(':memory:');

// Create tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE users (
    user_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    role TEXT,
    roll_number TEXT
  )`, (err) => {
    if (err) console.error('❌ Error creating users table:', err);
    else console.log('✅ Users table created');
  });

  // Events table
  db.run(`CREATE TABLE events (
    event_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    date TEXT,
    location TEXT,
    organizer_id INTEGER,
    description TEXT,
    status TEXT,
    FOREIGN KEY (organizer_id) REFERENCES users(user_id)
  )`);

  // Equipment table
  db.run(`CREATE TABLE equipment (
    equipment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT,
    status TEXT,
    location TEXT
  )`);

  // Bookings table
  db.run(`CREATE TABLE bookings (
    booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
    equipment_id INTEGER,
    event_id INTEGER,
    assigned_to INTEGER,
    booking_date TEXT,
    return_date TEXT,
    status TEXT,
    FOREIGN KEY (equipment_id) REFERENCES equipment(equipment_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    FOREIGN KEY (assigned_to) REFERENCES users(user_id)
  )`);

  // CheckIns table
  db.run(`CREATE TABLE checkins (
    checkin_id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER,
    user_id INTEGER,
    check_in_time TEXT,
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
  )`, (err) => {
    if (err) console.error('❌ Error creating checkins table:', err);
    else {
      console.log('✅ All tables created');
      // Load data AFTER tables are confirmed created
      loadStudentsData();
    }
  });
});

// Populate data from CSV
function loadStudentsData() {
  const csvPath = path.join(__dirname, '..', 'Students_data.csv');
  console.log('📂 Loading CSV from:', csvPath);
  
  let rowCount = 0;
  
  fs.createReadStream(csvPath)
    .pipe(csv())
    .on('data', (row) => {
      // Get the actual keys from the row object
      const keys = Object.keys(row);
      const name = row[keys[0]]; // First column is Student Name
      const rollNo = row[keys[1]]; // Second column is Roll No
      const email = row[keys[2]]; // Third column is Email
      
      if (rowCount === 0) {
        console.log('🔍 CSV Column headers:', keys);
        console.log('🔍 First row data:', { name, rollNo, email });
      }
      
      if (name && rollNo) {
        rowCount++;
        db.run(
          `INSERT INTO users (user_id, name, email, phone, role, roll_number) VALUES (?, ?, ?, ?, ?, ?)`,
          [rollNo, name, email || '', '', 'Participant', rollNo],
          (err) => {
            if (err) console.error('❌ Error inserting user:', name, err.message);
            else if (rowCount === 1) console.log('✅ First user inserted successfully');
          }
        );
      }
    })
    .on('end', () => {
      console.log(`✅ Students data loaded successfully - ${rowCount} users inserted`);
      
      // Add sample events with various organizers
      const events = [
        { name: 'Tech Symposium 2024', date: '2024-11-15', location: 'Main Auditorium', organizer_id: 241001001, description: 'Annual technical symposium featuring workshops on AI, Web Development, and Cloud Computing', status: 'Upcoming' },
        { name: 'Code Sprint Hackathon', date: '2024-11-20', location: 'Computer Lab Block A', organizer_id: 241001142, description: '24-hour coding challenge with prizes worth ₹50,000', status: 'Upcoming' },
        { name: 'Cultural Fest 2024', date: '2024-12-10', location: 'Open Ground', organizer_id: 241001050, description: 'Annual cultural festival with dance, music, and drama performances', status: 'Planning' },
        { name: 'Sports Day', date: '2024-10-28', location: 'Sports Complex', organizer_id: 241001100, description: 'Inter-department sports competition completed successfully', status: 'Completed' },
        { name: 'AI/ML Workshop Series', date: '2024-11-25', location: 'Lab 301', organizer_id: 241001001, description: 'Three-day workshop on Machine Learning fundamentals and practical applications', status: 'Upcoming' },
        { name: 'Web Development Bootcamp', date: '2024-12-01', location: 'Conference Hall', organizer_id: 241001020, description: 'Intensive bootcamp covering React, Node.js, and MongoDB', status: 'Planning' },
        { name: 'Robotics Exhibition', date: '2024-11-18', location: 'Exhibition Hall', organizer_id: 241001075, description: 'Display of student robotics projects and competitions', status: 'Upcoming' },
        { name: 'Placement Drive - TCS', date: '2024-10-15', location: 'Block B Auditorium', organizer_id: 241001001, description: 'Campus recruitment drive by Tata Consultancy Services', status: 'Completed' },
        { name: 'Photography Contest', date: '2024-11-22', location: 'Campus Wide', organizer_id: 241001150, description: 'Theme: "Campus Life" - Submit your best shots!', status: 'Upcoming' },
        { name: 'Guest Lecture: Cloud Computing', date: '2024-11-12', location: 'Seminar Hall', organizer_id: 241001001, description: 'Industry expert from AWS to discuss cloud architecture', status: 'Upcoming' },
        { name: 'Annual Day Celebration', date: '2024-12-20', location: 'Main Auditorium', organizer_id: 241001142, description: 'Celebrating achievements and talents of the year', status: 'Planning' },
        { name: 'Blood Donation Camp', date: '2024-11-08', location: 'Medical Center', organizer_id: 241001200, description: 'Organized in collaboration with local blood bank', status: 'Completed' }
      ];
      
      events.forEach(event => {
        db.run(
          `INSERT INTO events (name, date, location, organizer_id, description, status) VALUES (?, ?, ?, ?, ?, ?)`,
          [event.name, event.date, event.location, event.organizer_id, event.description, event.status]
        );
      });
      
      // Add sample equipment
      const equipment = [
        { name: 'Projector 1', category: 'Electronics', status: 'Available', location: 'Room 101' },
        { name: 'Projector 2', category: 'Electronics', status: 'Available', location: 'Room 102' },
        { name: 'Sound System', category: 'Electronics', status: 'Available', location: 'Auditorium' },
        { name: 'Microphone Set', category: 'Electronics', status: 'Available', location: 'Store' },
        { name: 'Camera', category: 'Electronics', status: 'Borrowed', location: 'Media Room' },
        { name: 'Laptop', category: 'Electronics', status: 'Available', location: 'IT Department' },
        { name: 'White Board', category: 'Furniture', status: 'Available', location: 'Room 201' },
        { name: 'Chairs (50)', category: 'Furniture', status: 'Available', location: 'Storage' },
        { name: 'Tables (20)', category: 'Furniture', status: 'Available', location: 'Storage' },
        { name: 'Banner Stand', category: 'Display', status: 'Available', location: 'Marketing' }
      ];
      
      equipment.forEach(eq => {
        db.run(
          `INSERT INTO equipment (name, category, status, location) VALUES (?, ?, ?, ?)`,
          [eq.name, eq.category, eq.status, eq.location]
        );
      });
      
      // Add sample bookings
      const bookings = [
        { equipment_id: 1, event_id: 1, assigned_to: 241001001, booking_date: '2024-11-10', return_date: '2024-11-16', status: 'Active' },
        { equipment_id: 3, event_id: 1, assigned_to: 241001001, booking_date: '2024-11-10', return_date: '2024-11-16', status: 'Active' },
        { equipment_id: 2, event_id: 2, assigned_to: 241001142, booking_date: '2024-11-15', return_date: '2024-11-21', status: 'Active' },
        { equipment_id: 6, event_id: 2, assigned_to: 241001142, booking_date: '2024-11-15', return_date: '2024-11-21', status: 'Active' },
        { equipment_id: 5, event_id: 7, assigned_to: 241001075, booking_date: '2024-11-12', return_date: '2024-11-19', status: 'Active' },
        { equipment_id: 8, event_id: 3, assigned_to: 241001050, booking_date: '2024-12-05', return_date: '2024-12-11', status: 'Pending' },
        { equipment_id: 9, event_id: 3, assigned_to: 241001050, booking_date: '2024-12-05', return_date: '2024-12-11', status: 'Pending' }
      ];
      
      bookings.forEach(booking => {
        db.run(
          `INSERT INTO bookings (equipment_id, event_id, assigned_to, booking_date, return_date, status) VALUES (?, ?, ?, ?, ?, ?)`,
          [booking.equipment_id, booking.event_id, booking.assigned_to, booking.booking_date, booking.return_date, booking.status]
        );
      });
      
      // Add some check-ins for completed/ongoing events
      const checkins = [
        { event_id: 4, user_id: 241001001, check_in_time: '2024-10-28T09:15:00' },
        { event_id: 4, user_id: 241001142, check_in_time: '2024-10-28T09:20:00' },
        { event_id: 4, user_id: 241001050, check_in_time: '2024-10-28T09:18:00' },
        { event_id: 4, user_id: 241001075, check_in_time: '2024-10-28T09:25:00' },
        { event_id: 8, user_id: 241001001, check_in_time: '2024-10-15T10:00:00' },
        { event_id: 8, user_id: 241001020, check_in_time: '2024-10-15T10:05:00' },
        { event_id: 8, user_id: 241001100, check_in_time: '2024-10-15T10:10:00' },
        { event_id: 12, user_id: 241001200, check_in_time: '2024-11-08T11:00:00' },
        { event_id: 12, user_id: 241001150, check_in_time: '2024-11-08T11:15:00' }
      ];
      
      checkins.forEach(checkin => {
        db.run(
          `INSERT INTO checkins (event_id, user_id, check_in_time) VALUES (?, ?, ?)`,
          [checkin.event_id, checkin.user_id, checkin.check_in_time]
        );
      });
      
      console.log('✅ Sample data loaded (12 events, 7 bookings, 9 check-ins)');
    });
}

// Data is now loaded from within the db.serialize callback after tables are created

// ========== API ENDPOINTS ==========

// Users endpoints
app.get('/api/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/users/:id', (req, res) => {
  db.get('SELECT * FROM users WHERE user_id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row || {});
  });
});

app.post('/api/users', (req, res) => {
  const { user_id, name, email, phone, role, roll_number } = req.body;
  db.run(
    'INSERT INTO users (user_id, name, email, phone, role, roll_number) VALUES (?, ?, ?, ?, ?, ?)',
    [user_id, name, email, phone, role, roll_number],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ user_id, name, email, phone, role, roll_number });
    }
  );
});

app.delete('/api/users/:id', (req, res) => {
  db.run('DELETE FROM users WHERE user_id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Events endpoints
app.get('/api/events', (req, res) => {
  db.all('SELECT * FROM events', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    // Map database fields to frontend expected fields
    const mappedRows = rows.map(row => ({
      event_id: row.event_id,
      event_name: row.name,
      event_date: row.date,
      venue: row.location,
      description: row.description,
      organizer_id: row.organizer_id,
      status: row.status
    }));
    res.json(mappedRows);
  });
});

app.get('/api/events/:id', (req, res) => {
  db.get('SELECT * FROM events WHERE event_id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row || {});
  });
});

app.post('/api/events', (req, res) => {
  const { name, date, location, organizer_id, description, status } = req.body;
  db.run(
    'INSERT INTO events (name, date, location, organizer_id, description, status) VALUES (?, ?, ?, ?, ?, ?)',
    [name, date, location, organizer_id, description, status],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ event_id: this.lastID, name, date, location, organizer_id, description, status });
    }
  );
});

app.put('/api/events/:id', (req, res) => {
  const { name, date, location, organizer_id, description, status } = req.body;
  db.run(
    'UPDATE events SET name = ?, date = ?, location = ?, organizer_id = ?, description = ?, status = ? WHERE event_id = ?',
    [name, date, location, organizer_id, description, status, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ event_id: parseInt(req.params.id), name, date, location, organizer_id, description, status });
    }
  );
});

app.delete('/api/events/:id', (req, res) => {
  db.run('DELETE FROM events WHERE event_id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Equipment endpoints
app.get('/api/equipment', (req, res) => {
  db.all('SELECT * FROM equipment', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    // Map database fields to frontend expected fields
    const mappedRows = rows.map(row => ({
      equip_id: row.equipment_id,
      equip_name: row.name,
      category: row.category,
      status: row.status,
      location: row.location,
      purchase_date: row.purchase_date || '2024-01-01'
    }));
    res.json(mappedRows);
  });
});

app.get('/api/equipment/:id', (req, res) => {
  db.get('SELECT * FROM equipment WHERE equipment_id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row || {});
  });
});

app.post('/api/equipment', (req, res) => {
  const { name, category, status, location } = req.body;
  db.run(
    'INSERT INTO equipment (name, category, status, location) VALUES (?, ?, ?, ?)',
    [name, category, status, location],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ equipment_id: this.lastID, name, category, status, location });
    }
  );
});

app.put('/api/equipment/:id', (req, res) => {
  const { name, category, status, location } = req.body;
  db.run(
    'UPDATE equipment SET name = ?, category = ?, status = ?, location = ? WHERE equipment_id = ?',
    [name, category, status, location, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ equipment_id: parseInt(req.params.id), name, category, status, location });
    }
  );
});

app.delete('/api/equipment/:id', (req, res) => {
  db.run('DELETE FROM equipment WHERE equipment_id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Bookings endpoints
app.get('/api/bookings', (req, res) => {
  db.all('SELECT * FROM bookings', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    // Map database fields to frontend expected fields
    const mappedRows = rows.map(row => ({
      booking_id: row.booking_id,
      event_id: row.event_id,
      equip_id: row.equipment_id,
      assigned_to: row.assigned_to,
      borrow_date: row.booking_date,
      return_date: row.return_date,
      remarks: row.status
    }));
    res.json(mappedRows);
  });
});

app.post('/api/bookings', (req, res) => {
  const { equipment_id, event_id, assigned_to, booking_date, return_date, status } = req.body;
  db.run(
    'INSERT INTO bookings (equipment_id, event_id, assigned_to, booking_date, return_date, status) VALUES (?, ?, ?, ?, ?, ?)',
    [equipment_id, event_id, assigned_to, booking_date, return_date, status],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ booking_id: this.lastID, equipment_id, event_id, assigned_to, booking_date, return_date, status });
    }
  );
});

app.delete('/api/bookings/:id', (req, res) => {
  db.run('DELETE FROM bookings WHERE booking_id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// CheckIns endpoints
app.get('/api/checkins', (req, res) => {
  db.all('SELECT * FROM checkins', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    // Map database fields to frontend expected fields
    const mappedRows = rows.map(row => ({
      checkin_id: row.checkin_id,
      user_id: row.user_id,
      event_id: row.event_id,
      checkin_time: row.check_in_time,
      checkout_time: null,
      status: 'Present'
    }));
    res.json(mappedRows);
  });
});

app.post('/api/checkins', (req, res) => {
  const { event_id, user_id, check_in_time } = req.body;
  db.run(
    'INSERT INTO checkins (event_id, user_id, check_in_time) VALUES (?, ?, ?)',
    [event_id, user_id, check_in_time],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ checkin_id: this.lastID, event_id, user_id, check_in_time });
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Eventrix backend running on http://localhost:${PORT}`);
});
