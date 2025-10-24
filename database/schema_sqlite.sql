-- =============================================
-- Eventrix Database Schema (SQLite Version)
-- =============================================
-- Simplified version for local development
-- =============================================

-- Drop existing tables if they exist
DROP TABLE IF EXISTS CheckIns;
DROP TABLE IF EXISTS Bookings;
DROP TABLE IF EXISTS Equipment;
DROP TABLE IF EXISTS Events;
DROP TABLE IF EXISTS Users;

-- =============================================
-- TABLE: Users
-- =============================================
CREATE TABLE Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    role TEXT NOT NULL CHECK(role IN ('Organizer', 'Volunteer', 'Participant')) DEFAULT 'Participant',
    roll_number TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON Users(email);
CREATE INDEX idx_users_role ON Users(role);
CREATE INDEX idx_users_roll_number ON Users(roll_number);

-- =============================================
-- TABLE: Events
-- =============================================
CREATE TABLE Events (
    event_id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_name TEXT NOT NULL,
    event_date DATETIME NOT NULL,
    venue TEXT NOT NULL,
    description TEXT,
    organizer_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES Users(user_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_events_date ON Events(event_date);
CREATE INDEX idx_events_organizer ON Events(organizer_id);
CREATE INDEX idx_events_venue ON Events(venue);

-- =============================================
-- TABLE: Equipment
-- =============================================
CREATE TABLE Equipment (
    equip_id INTEGER PRIMARY KEY AUTOINCREMENT,
    equip_name TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('Available', 'Borrowed', 'Damaged')) DEFAULT 'Available',
    location TEXT,
    purchase_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_equipment_status ON Equipment(status);
CREATE INDEX idx_equipment_category ON Equipment(category);
CREATE INDEX idx_equipment_location ON Equipment(location);

-- =============================================
-- TABLE: Bookings
-- =============================================
CREATE TABLE Bookings (
    booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL,
    equip_id INTEGER NOT NULL,
    assigned_to INTEGER NOT NULL,
    borrow_date DATE NOT NULL,
    return_date DATE,
    remarks TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES Events(event_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (equip_id) REFERENCES Equipment(equip_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES Users(user_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CHECK (return_date IS NULL OR return_date >= borrow_date)
);

CREATE INDEX idx_bookings_event ON Bookings(event_id);
CREATE INDEX idx_bookings_equipment ON Bookings(equip_id);
CREATE INDEX idx_bookings_assigned_user ON Bookings(assigned_to);
CREATE INDEX idx_bookings_borrow_date ON Bookings(borrow_date);

-- =============================================
-- TABLE: CheckIns
-- =============================================
CREATE TABLE CheckIns (
    checkin_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL,
    checkin_time DATETIME NOT NULL,
    checkout_time DATETIME,
    status TEXT NOT NULL CHECK(status IN ('Present', 'Absent')) DEFAULT 'Present',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (event_id) REFERENCES Events(event_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CHECK (checkout_time IS NULL OR checkout_time >= checkin_time),
    UNIQUE(user_id, event_id)
);

CREATE INDEX idx_checkins_user ON CheckIns(user_id);
CREATE INDEX idx_checkins_event ON CheckIns(event_id);
CREATE INDEX idx_checkins_time ON CheckIns(checkin_time);

-- =============================================
-- VIEWS
-- =============================================

-- Event Summary View
CREATE VIEW vw_event_summary AS
SELECT 
    e.event_id,
    e.event_name,
    e.event_date,
    e.venue,
    e.description,
    u.name AS organizer_name,
    u.email AS organizer_email,
    COUNT(DISTINCT c.checkin_id) AS attendee_count,
    COUNT(DISTINCT b.booking_id) AS equipment_count
FROM Events e
LEFT JOIN Users u ON e.organizer_id = u.user_id
LEFT JOIN CheckIns c ON e.event_id = c.event_id
LEFT JOIN Bookings b ON e.event_id = b.event_id
GROUP BY e.event_id, e.event_name, e.event_date, e.venue, e.description, u.name, u.email;

-- Equipment Status View
CREATE VIEW vw_equipment_status AS
SELECT 
    eq.equip_id,
    eq.equip_name,
    eq.category,
    eq.status,
    eq.location,
    b.event_id,
    ev.event_name,
    u.name AS assigned_to_name,
    b.borrow_date,
    b.return_date
FROM Equipment eq
LEFT JOIN Bookings b ON eq.equip_id = b.equip_id AND b.return_date IS NULL
LEFT JOIN Events ev ON b.event_id = ev.event_id
LEFT JOIN Users u ON b.assigned_to = u.user_id;

-- User Activity View
CREATE VIEW vw_user_activity AS
SELECT 
    u.user_id,
    u.name,
    u.email,
    u.role,
    u.roll_number,
    COUNT(DISTINCT CASE WHEN e.organizer_id = u.user_id THEN e.event_id END) AS organized_events,
    COUNT(DISTINCT c.event_id) AS attended_events,
    COUNT(DISTINCT b.booking_id) AS equipment_bookings
FROM Users u
LEFT JOIN Events e ON u.user_id = e.organizer_id
LEFT JOIN CheckIns c ON u.user_id = c.user_id
LEFT JOIN Bookings b ON u.user_id = b.assigned_to
GROUP BY u.user_id, u.name, u.email, u.role, u.roll_number;

-- =============================================
-- TRIGGERS
-- =============================================

-- Trigger: Update timestamp on Users table
CREATE TRIGGER trg_users_updated_at
AFTER UPDATE ON Users
FOR EACH ROW
BEGIN
    UPDATE Users SET updated_at = CURRENT_TIMESTAMP WHERE user_id = NEW.user_id;
END;

-- Trigger: Update timestamp on Events table
CREATE TRIGGER trg_events_updated_at
AFTER UPDATE ON Events
FOR EACH ROW
BEGIN
    UPDATE Events SET updated_at = CURRENT_TIMESTAMP WHERE event_id = NEW.event_id;
END;

-- Trigger: Update timestamp on Equipment table
CREATE TRIGGER trg_equipment_updated_at
AFTER UPDATE ON Equipment
FOR EACH ROW
BEGIN
    UPDATE Equipment SET updated_at = CURRENT_TIMESTAMP WHERE equip_id = NEW.equip_id;
END;

-- Trigger: Update timestamp on Bookings table
CREATE TRIGGER trg_bookings_updated_at
AFTER UPDATE ON Bookings
FOR EACH ROW
BEGIN
    UPDATE Bookings SET updated_at = CURRENT_TIMESTAMP WHERE booking_id = NEW.booking_id;
END;

-- Trigger: Update timestamp on CheckIns table
CREATE TRIGGER trg_checkins_updated_at
AFTER UPDATE ON CheckIns
FOR EACH ROW
BEGIN
    UPDATE CheckIns SET updated_at = CURRENT_TIMESTAMP WHERE checkin_id = NEW.checkin_id;
END;

-- Trigger: Auto-update equipment status when booking is returned
CREATE TRIGGER trg_update_equipment_on_return
AFTER UPDATE ON Bookings
FOR EACH ROW
WHEN NEW.return_date IS NOT NULL AND OLD.return_date IS NULL
BEGIN
    UPDATE Equipment 
    SET status = 'Available' 
    WHERE equip_id = NEW.equip_id 
    AND status = 'Borrowed';
END;
